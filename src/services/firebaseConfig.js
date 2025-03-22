// src/services/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// Si usas Analytics u otros servicios, los puedes importar también

const firebaseConfig = {
  apiKey: "AIzaSyC_jFVTGZaT9-QeyqjwoXAW7O_BNbgybmo",
  authDomain: "listas-de-produtos-c8e5f.firebaseapp.com",
  projectId: "listas-de-produtos-c8e5f",
  storageBucket: "listas-de-produtos-c8e5f.firebasestorage.app",
  messagingSenderId: "1000695329541",
  appId: "1:1000695329541:web:dfbe495fb0d783f0633d6c",
  measurementId: "G-PMLXFE2NZ3"
};

// Inicializa la app
const app = initializeApp(firebaseConfig);

// Inicializa y exporta el servicio de autenticación
export const auth = getAuth(app);

export const db = getFirestore(app);


// Si necesitas Analytics:
// import { getAnalytics } from "firebase/analytics";
// export const analytics = getAnalytics(app);
