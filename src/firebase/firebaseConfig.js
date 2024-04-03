import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC9sokn9RGrq2kiSeFtbRS5_MIxSYgGD8g",
  authDomain: "registro-gastos-fraiche.firebaseapp.com",
  projectId: "registro-gastos-fraiche",
  storageBucket: "registro-gastos-fraiche.appspot.com",
  messagingSenderId: "1083266887667",
  appId: "1:1083266887667:web:99ae6ffb3b76c33cec2c86",
  measurementId: "G-L6T05Q966C"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export default db