// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getFirestore} from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js';
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAWSHSS6v0pG5VxrmfXElArcMpjBT5o6hg",
  authDomain: "app-be149.firebaseapp.com",
  projectId: "app-be149",
  storageBucket: "app-be149.appspot.com",
  messagingSenderId: "18569998394",
  appId: "1:18569998394:web:c8efa4c8b656702c1cc503"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Access Firestore
const db = getFirestore(app);

// Specify the name of the collection you want to read from
const collectionName = "Branch_Manager";

// Create a reference to the collection
const collectionRef = collection(db, collectionName);

// Use getDocs to retrieve the documents in the collection
getDocs(collectionRef)
  .then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      // Access data for each document
      const data = doc.data();
      console.log("Document ID: ", doc.id);
      console.log("Document Data: ", data);
    });
  })
  .catch((error) => {
    console.error("Error reading documents: ", error);
  });


