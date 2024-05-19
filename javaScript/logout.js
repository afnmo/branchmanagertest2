import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";

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

// Get the Firebase Authentication object
const auth = getAuth(app);

document.addEventListener("DOMContentLoaded", function () {
    // Select the link by its id
    const signOutLink = document.getElementById("signOutLink");

    // Add a click event listener to the link
    signOutLink.addEventListener("click", function (e) {
        e.preventDefault(); // Prevent the default behavior (navigating to a new page)

        // Call the signOut function
        signOut();
    });
});

// Define the signOut function
function signOut() {
    auth.signOut().then(() => {
        // Sign-out successful.
        window.location.href = "index.html";
        console.log("User has been successfully logged out.");
    }).catch((error) => {
        // An error happened.
        console.error("Error during sign-out: ", error);
    });
}
