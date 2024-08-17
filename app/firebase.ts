// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

import * as dotenv from 'dotenv'
dotenv.config();

import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_APIKEY,
  authDomain: "udemy-cahtapp-with-chatgpt.firebaseapp.com",
  projectId: "udemy-cahtapp-with-chatgpt",
  storageBucket: "udemy-cahtapp-with-chatgpt.appspot.com",
  messagingSenderId: "496333252153",
  appId: "1:496333252153:web:2dd8667c39a6750b054fe8",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

//If you want to use a database name other than the default, use the following pattern:
export const db = getFirestore(app);
// export const db = getFirestore(app, "udemy-chatapp-with-chatgpt")
export const auth = getAuth(app);