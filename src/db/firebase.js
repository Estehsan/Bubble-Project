import * as firebase from "firebase";
import "firebase/auth";
import "firebase/database";
import "firebase/firestore";
import "firebase/storage";
import messaging from "@react-native-firebase/messaging";
import OneSignal from "react-native-onesignal";
import { FIREBASE_CONFIG } from "./keys";

var firebaseConfig = FIREBASE_CONFIG;

let app;
if (firebase.apps.length === 0) {
  app = firebase.initializeApp(firebaseConfig);
} else {
  app = firebase.app();
}

// firebase.initializeApp(firebaseConfig);

// const db = app.firestore();
const firestore = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

firestore.settings({ experimentalForceLongPolling: true, merge: true });

const signUp = (userDetails) => {
  const {
    email,
    password,
    userProfileImage,
    gender,
    name,
    DOB,
    UserProfileImageConfig,
    contentType,
    selectedTeams,
    navigation,
  } = userDetails;
  const metadata = {
    contentType: contentType,
  };
  return new Promise((resolve, reject) => {
    auth
      .createUserWithEmailAndPassword(email, password)
      .then(async (userCredential) => {
        // Signed in
        var userInfo = userCredential.user;
        console.log("userinfo =>", userInfo);
        var user = auth.currentUser;
        var uid;
        if (user != null) {
          uid = user.uid;
        }

        const filename = userProfileImage.substring(
          userProfileImage.lastIndexOf("/") + 1
        );

        const blob = await new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.onload = function () {
            resolve(xhr.response);
          };
          xhr.onerror = function () {
            reject(new TypeError("Network request failed"));
          };
          xhr.responseType = "blob";
          xhr.open("GET", userProfileImage, true);
          xhr.send(null);
        });

        const { userId } = await OneSignal.getDeviceState();

        storage
          .ref()
          .child(`userProfileImage/${uid}/` + filename)
          .put(blob, metadata)
          .then((url) => {
            url.ref
              .getDownloadURL()
              .then((success) => {
                console.log(success);
                const userProfileImageUrl = success;
                const userDetailsForDb = {
                  userName: name,
                  userEmail: email,
                  userPassword: password,
                  userGender: gender,
                  userDateOfBirth: DOB,
                  selectedTeams: selectedTeams,
                  userUid: uid,
                  userProfileImageUrl: userProfileImageUrl,
                  latitude: 0,
                  longitude: 0,
                  candy: 0,
                  notificationId: userId,
                  created_at: firebase.database.ServerValue.TIMESTAMP,
                };
                let user = firestore
                  .collection("users")
                  .doc(uid)
                  .set(userDetailsForDb);
                console.log(user);
                // navigation.push("AuthLoading");
                resolve(userDetailsForDb);
              })
              .catch((error) => {
                // Handle Errors here.
                let errorCode = error.code;
                let errorMessage = error.message;
                console.log("Error in getDownloadURL function", errorMessage);
                reject(errorMessage);
              });
          })
          .catch((error) => {
            // Handle Errors here.
            let errorCode = error.code;
            let errorMessage = error.message;
            console.log("Error in Image Uploading", errorMessage);
            reject(errorMessage);
          });
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(error);
        // ..
      });
  });
};

function logIn({ userLoginDetails, ...props }) {
  const { userLoginEmail, userLoginPassword } = userLoginDetails;
  firebase
    .auth()
    .signInWithEmailAndPassword(userLoginEmail, userLoginPassword)
    .then((success) => {
      db.collection("users")
        .doc(success.user.uid)
        .get()
        .then((snapshot) => {
          console.log(snapshot.data());
          userLoginDetails.navigation.replace("Home");
        });
    })
    .catch((error) => {
      // Handle Errors here.
      // var errorCode = error.code;
      var errorMessage = error.message;
    });
}

export { messaging, auth, firestore, storage, logIn, signUp };
