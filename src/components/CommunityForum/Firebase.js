
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "YOUR API KEY",
    authDomain: "YOUR AUTHDOMAIN",
    projectId: "YOUR PROJECT ID",
    storageBucket: "YOUR STORAGE BUCKET",
    messagingSenderId: "YOUR MESSAGE SENDER ID",
    appId: "YOUR APP ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);
const storage = getStorage(app);

const signInWithGoogle = () => signInWithPopup(auth, provider);
const signOutFromGoogle = () => signOut(auth);

export { auth, db, signInWithGoogle, signOutFromGoogle ,provider,storage};
