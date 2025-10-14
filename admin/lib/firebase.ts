import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAP4_F1nFmeSwOdoU25VqNTKua_jNw0qlY",
  authDomain: "gaupro-2068e.firebaseapp.com",
  projectId: "gaupro-2068e",
  storageBucket: "gaupro-2068e.firebasestorage.app",
  messagingSenderId: "7409185599",
  appId: "1:7409185599:web:2a36070c080fe848ffd98a",
  measurementId: "G-9FZY4X1XKE"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
