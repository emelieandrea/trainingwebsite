// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyB370DdU7nYesHsDC7llit0zp8qjj3D63Y",
    authDomain: "training-database-a5ba0.firebaseapp.com",
    projectId: "training-database-a5ba0",
    storageBucket: "training-database-a5ba0.appspot.com",
    messagingSenderId: "555922962179",
    appId: "1:555922962179:web:f1358b5610320df30d1b36",
    measurementId: "G-X4YLK7PC0L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
const db = getFirestore(app);

export { db };

export default app;