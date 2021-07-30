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

function signUp(userDetails) {
  return new Promise((resolve, reject) => {
    const {
      userName,
      userEmail,
      userPassword,
      userGender,
      userProfileImage /*userMapLink*/,
    } = userDetails;
    firebase
      .auth()
      .createUserWithEmailAndPassword(
        userDetails.userEmail,
        userDetails.userPassword
      )
      .then((success) => {
        let user = firebase.auth().currentUser;
        var uid;
        if (user != null) {
          uid = user.uid;
        }
        firebase
          .storage()
          .ref()
          .child(`userProfileImage/${uid}/` + userProfileImage.name)
          .put(userProfileImage)
          .then((url) => {
            url.ref
              .getDownloadURL()
              .then((success) => {
                const userProfileImageUrl = success;
                console.log(userProfileImageUrl);
                const userDetailsForDb = {
                  userName: userName,
                  userEmail: userEmail,
                  userPassword: userPassword,
                  userGender: userGender,
                  userUid: uid,
                  userProfileImageUrl: userProfileImageUrl,
                  //   userMapLink: userMapLink,
                };
                db.collection("users")
                  .doc(uid)
                  .set(userDetailsForDb)
                  .then((docRef) => {
                    // console.log("Document written with ID: ", docRef.id);
                    userDetails.navigation.push("Home");
                    resolve(userDetailsForDb);
                  })
                  .catch(function (error) {
                    console.error("Error adding document: ", error);
                    reject(error);
                  });
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
        var errorMessage = error.message;
        console.log("Error in Authentication", errorMessage);
        reject(errorMessage);
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
