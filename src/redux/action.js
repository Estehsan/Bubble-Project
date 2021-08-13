import firebase from "../db/firebase";
import { auth, storage, firestore } from "../db/firebase";

function signUp(userDetails) {
  return (dispatch) => {
    var promise = new Promise((resolve, reject) => {
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
                  // firebase.auth().currentUser.sendEmailVerification()
                  //     .then(() => {

                  //     })
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
                  firebase
                    .firestore()
                    .collection("users")
                    .doc(uid)
                    .set(userDetailsForDb)
                    .then((docRef) => {
                      userDetails.navigation.push("MonProfil");
                      resolve(userDetailsForDb);
                      dispatch({
                        type: "SIGNUP_USER",
                        user: { isLogin: true },
                      });
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
  };
}

function logIn(userLoginDetails) {
  return new Promise((resolve, reject) => {
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
            console.log("snapshot.data =>>", snapshot.data().isRestaurant);
            resolve(success);
          });
      })
      .catch((error) => {
        // Handle Errors here.
        // var errorCode = error.code;
        var errorMessage = error.message;
        reject(errorMessage);
      });
  });
}

// function current_User() {
//     return async (dispatch) => {
//         const getUser = await auth.onAuthStateChanged((user) => {
//             if (user) {
//                 // User is signed in.
//                 // console.log("update_user =>>", user.uid)
//                 db.collection('users').doc(user.uid).get().then((snapshot) => {
//                     // console.log("snapshot.data =>>", snapshot.data());
//                     dispatch({
//                         type: 'SET_USER',
//                         user: { ...snapshot.data(), isLogin: true }
//                     })
//                 })
//             } else {
//                 // No user is signed in.
//             }

//         })
//     }
// }

export { logIn, signUp, current_User };
