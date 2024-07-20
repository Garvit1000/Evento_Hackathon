
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

//  Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCX8BMv9hQX6-laaNP2Mdvu_wjf9tCz-XE",
    authDomain: "evento-3655e.firebaseapp.com",
    projectId: "evento-3655e",
    storageBucket: "evento-3655e.appspot.com",
    messagingSenderId: "1045833272948",
    appId: "1:1045833272948:web:495d72f9d405e484104b21"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Initialize Firebase Auth
const auth = getAuth(app);

export { app, db, auth };
