import firebase from "firebase/app";
import "firebase/storage";
import "firebase/auth";
import "firebase/database";

firebase.initializeApp({
  apiKey: "AIzaSyBAoW22Vxn_rKnmeyuFBUnFu_GRwkOy_1M",
  authDomain: "chat-51d2b.firebaseapp.com",
  databaseURL: "https://chat-51d2b-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "chat-51d2b",
  storageBucket: "chat-51d2b.appspot.com",
  messagingSenderId: "1060071282237",
  appId: "1:1060071282237:web:00aab0149778c4eab77c54",
});

const db = firebase.database();
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();
const storage = firebase.storage();
const timestamp = firebase.database.ServerValue.TIMESTAMP;

export { auth, provider, storage, db, timestamp };
