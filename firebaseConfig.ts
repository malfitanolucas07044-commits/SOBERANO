import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA-3rMd5EwWngB0a-fFBm81HGd39xRZcpA",
  authDomain: "soberano-web.firebaseapp.com",
  projectId: "soberano-web",
  storageBucket: "soberano-web.firebasestorage.app",
  messagingSenderId: "744447620587",
  appId: "1:744447620587:web:62cd42603bffc5523c55ae",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);

export const isFirebaseEnabled = true;

console.log("🔥 Firebase OK:", {
  app: app.name,
  db,
  storage,
  auth,
});
