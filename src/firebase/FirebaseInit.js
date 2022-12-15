import fb from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";
import "firebase/compat/storage";

const firebaseApp = fb.initializeApp({
  apiKey: "AIzaSyAofDEfeFygYq-CImNM6j0cTHsH-4CSB2Q",
  authDomain: "daan-insta.firebaseapp.com",
  projectId: "daan-insta",
  storageBucket: "daan-insta.appspot.com",
  messagingSenderId: "787147740816",
  appId: "1:787147740816:web:7ff4c6cb537ec853376a15"
});

const db = firebaseApp.firestore();
const auth = fb.auth();
const storage = fb.storage();

export { db, auth, storage, fb };
