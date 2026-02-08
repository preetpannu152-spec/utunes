import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCzoaLwmECSjb_xq8e-EnVFx4jonSXMnUw",
  authDomain: "utunes-020726.firebaseapp.com",
  projectId: "utunes-020726",
  storageBucket: "utunes-020726.firebasestorage.app",
  messagingSenderId: "643884475959",
  appId: "1:643884475959:web:81522c05b67df2853b01b2",
  measurementId: "G-T7TTHSBXDT"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
