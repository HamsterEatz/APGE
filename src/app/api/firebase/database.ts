import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    databaseURL: process.env.FIREBASE_URL
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export default database;