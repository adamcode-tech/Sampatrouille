// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc, updateDoc, increment, collection, addDoc } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD6LjxYTrK8HaBOdCb3zMdqs2PQ3v37fVM",
  authDomain: "sampatrouille-2ad1a.firebaseapp.com",
  projectId: "sampatrouille-2ad1a",
  storageBucket: "sampatrouille-2ad1a.firebasestorage.app",
  messagingSenderId: "350840821095",
  appId: "1:350840821095:web:3dc8ef94ddde2d6329cbc2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

export { db, doc, setDoc, getDoc, updateDoc, increment, collection, addDoc };
