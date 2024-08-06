import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore';
import {getStorage} from 'firebase/storage';

const firebaseConfig = {
  
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "bm-chat-fb-app.firebaseapp.com",
  projectId: "bm-chat-fb-app",
  storageBucket: "bm-chat-fb-app.appspot.com",
  messagingSenderId: "908878310144",
  appId: "1:908878310144:web:0b401acdaf74473065a1e5",
};

const app = initializeApp(firebaseConfig);

export const auth=getAuth()
export const db=getFirestore()
export const storage=getStorage()