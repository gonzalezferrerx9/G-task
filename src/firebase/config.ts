// =================================================================================================================================================================
// CONFIGURACIÓN DE FIREBASE
// =================================================================================================================================================================
import { initializeApp, getApps, getApp, type FirebaseOptions } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// =================================================================================================================================================================
// VALIDACIÓN Y OBTENCIÓN DE LA CONFIGURACIÓN DE FIREBASE
// =================================================================================================================================================================
function getFirebaseConfig(): FirebaseOptions {
  const firebaseConfig: FirebaseOptions = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };

  for (const key in firebaseConfig) {
    if (firebaseConfig[key as keyof FirebaseOptions] === undefined) {
       throw new Error(
        `Error de configuración: La variable de entorno NEXT_PUBLIC_FIREBASE_${key.toUpperCase()} no está definida. ` +
        `Asegúrate de que tu archivo .env.local exista, contenga todas las claves necesarias y que hayas reiniciado el servidor de desarrollo.`
      );
    }
  }

  return firebaseConfig;
}

// =================================================================================================================================================================
// INICIALIZAR FIREBASE Y EXPORTAR SERVICIOS
// =================================================================================================================================================================
const firebaseConfig = getFirebaseConfig();
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
