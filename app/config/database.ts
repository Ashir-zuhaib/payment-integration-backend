// Import necessary Firebase modules
import { FirebaseApp, initializeApp } from "firebase/app";
import {
  Auth,
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
} from "firebase/auth";
import {
  Firestore,
  Timestamp,
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  setDoc,
  updateDoc,
  where,
  deleteDoc,
} from "firebase/firestore/lite";
import {
  FirebaseStorage,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
} from "firebase/storage";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBwtpwXsjr1ClDPsR0zphiSOrdRKV_IEvo",
  authDomain: "payment-33ad2.firebaseapp.com",
  projectId: "payment-33ad2",
  storageBucket: "payment-33ad2.firebasestorage.app",
  messagingSenderId: "409621210979",
  appId: "1:409621210979:web:c5cbb1ddb0448af13b9556"
}

// Initialize Firebase App
const fireApp: FirebaseApp = initializeApp(firebaseConfig);

// Initialize Firestore and Auth
const fireDB: Firestore = getFirestore(fireApp);
const auth: Auth = getAuth(fireApp);

// Initialize Firebase Storage
const storage: FirebaseStorage = getStorage(fireApp);

// Export the necessary modules
export {
  Timestamp,
  addDoc,
  auth,
  collection,
  createUserWithEmailAndPassword,
  doc,
  fireApp,
  fireDB,
  getDoc,
  getDocs,
  getDownloadURL,
  getStorage,
  query,
  ref,
  setDoc,
  signInWithEmailAndPassword,
  storage,
  updateDoc,
  uploadBytes,
  where,
  deleteDoc
};
