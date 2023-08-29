import { initializeApp } from 'firebase/app';
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBAK9E0LDEaCcH17KtgzMkx08Mh78NhohE",
  authDomain: "buysell-ae279.firebaseapp.com",
  projectId: "buysell-ae279",
  storageBucket: "buysell-ae279.appspot.com",
  messagingSenderId: "152844100037",
  appId: "1:152844100037:web:f6c4039a236b456e9babac"
    // measurementId: "G-H2Y24DGVTV"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
