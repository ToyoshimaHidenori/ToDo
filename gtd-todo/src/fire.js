import firebase from "firebase/app";
import "firebase/auth";

export const app = () => {
  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyAIZ8k0Ego7xGT0x1uc0dIFUFK-iUMhGO8",
    authDomain: "neutodo.firebaseapp.com",
    databaseURL: "https://neutodo.firebaseio.com",
    projectId: "neutodo",
    storageBucket: "neutodo.appspot.com",
    messagingSenderId: "912686861825",
    appId: "1:912686861825:web:265d66a218a91bb70a3a00",
    measurementId: "G-8EMHMXKZF6",
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  firebase.analytics();
};
