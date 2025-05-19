import { initializeApp } from "firebase/app";
import { getMessaging, onMessage, isSupported } from "firebase/messaging";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_APP_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_APP_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_APP_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_APP_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);

// Soporte para navegadores/entornos sin messaging
let messaging;
const initializeMessaging = async () => {
  if (await isSupported()) {
    messaging = getMessaging(app);
  }
  return messaging;
};

initializeMessaging();

export { messaging, onMessage };
