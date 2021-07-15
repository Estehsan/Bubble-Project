import * as firebase from "firebase";
import "firebase/auth";
import "firebase/database";
import "firebase/firestore";

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
const auth = firebase.auth();

export { db, auth };
