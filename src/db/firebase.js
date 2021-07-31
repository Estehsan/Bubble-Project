import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/firestore";
import "firebase/storage";

var firebaseConfig = {
  apiKey: "AIzaSyDe6BeaQ565phuRr3XaSyxTE2H45G50j3U",
  authDomain: "bubble-6f15d.firebaseapp.com",
  projectId: "bubble-6f15d",
  storageBucket: "bubble-6f15d.appspot.com",
  messagingSenderId: "744912611069",
  appId: "1:744912611069:web:8f44dfe45629faf2894094",
  measurementId: "G-4YC4STKFS9",
};

let app;
if (firebase.apps.length === 0) {
  app = firebase.initializeApp(firebaseConfig);
} else {
  app = firebase.app();
}

const db = app.firestore();
const firestore = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

const signUp = (userDetails) => {

  const { email, password, userProfileImage, gender, FirstName, LastName, UserProfileImageConfig, contentType, navigation } = userDetails;
  const metadata = {
    contentType: contentType
  }
  return new Promise((resolve, reject) => {
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // Signed in
        var userInfo = userCredential.user;
        console.log("userinfo =>", userInfo);
        var user = auth.currentUser;
        var uid;
        if (user != null) {
          uid = user.uid;
        }
        storage
          .ref()
          .child(`userProfileImage/${uid}/` + userProfileImage.substr(userProfileImage.length - 6))
          .put(UserProfileImageConfig, metadata)
          .then((url) => {
            url.ref
              .getDownloadURL()
              .then((success) => {
                const userProfileImageUrl = success;
                console.log(userProfileImageUrl);
                const userDetailsForDb = {
                  userName: FirstName + LastName,
                  userEmail: email,
                  userPassword: password,
                  userGender: gender,
                  userUid: uid,
                  userProfileImageUrl: userProfileImageUrl,
                }
                let user = firestore
                  .collection("users")
                  .doc(uid)
                  .set(userDetailsForDb)
                console.log(user)
                // navigation.push("Home")
                resolve(userDetailsForDb)

              })
              .catch((error) => {
                // Handle Errors here.
                let errorCode = error.code;
                let errorMessage = error.message;
                console.log(
                  "Error in getDownloadURL function",
                  errorMessage
                );
                reject(errorMessage)
              });
          })
          .catch((error) => {
            // Handle Errors here.
            let errorCode = error.code;
            let errorMessage = error.message;
            console.log("Error in Image Uploading", errorMessage);
            reject(errorMessage)
          });
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(error);
        // ..
      });
  });
}

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

export { db, auth, firestore, storage, logIn, signUp };

// export const app = firebase.initializeApp(firebaseConfig);
// export const db = firebase.firestore();
// export const auth = firebase.auth();
// export const storage = firebase.storage();
