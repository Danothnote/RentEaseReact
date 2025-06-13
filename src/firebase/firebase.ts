// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCQNgdhjnkFnZOp9g-HB6NlwbEpD91LDZM",
  authDomain: "renteasereact.firebaseapp.com",
  projectId: "renteasereact",
  storageBucket: "renteasereact.firebasestorage.app",
  messagingSenderId: "867846890540",
  appId: "1:867846890540:web:937a0da8c12eded0195d89"
};


export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);