
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyCX8BMv9hQX6-laaNP2Mdvu_wjf9tCz-XE",
    authDomain: "evento-3655e.firebaseapp.com",
    projectId: "evento-3655e",
    storageBucket: "evento-3655e.appspot.com",
    messagingSenderId: "1045833272948",
    appId: "1:1045833272948:web:495d72f9d405e484104b21"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);
const storage = getStorage(app);

const signInWithGoogle = () => signInWithPopup(auth, provider);
const signOutFromGoogle = () => signOut(auth);

export { auth, db, signInWithGoogle, signOutFromGoogle ,provider,storage};
