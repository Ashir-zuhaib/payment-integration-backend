import admin from "firebase-admin";
import serviceAccount from "./serviceAccountKey";
import { getStorage } from "firebase/storage";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

console.log("Firebase Admin initialized successfully");
export const ServerStorage = admin.storage().bucket();
export default admin;
