// Import the functions you need from the SDKs you need
import { initializeApp  } from "firebase/app";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB_9dgN0Lvl2439OvAPXugmE2kpbf6ZZ8o",
  authDomain: "burnbook-9055f.firebaseapp.com",
  projectId: "burnbook-9055f",
  storageBucket: "burnbook-9055f.appspot.com",
  messagingSenderId: "159801884433",
  appId: "1:159801884433:web:72b551229b877d039f16b0"
};
// Initialize Firebase
const firebase = initializeApp(firebaseConfig);
const database = getDatabase(firebase);
// const dbRef = ref(database);

export default database;