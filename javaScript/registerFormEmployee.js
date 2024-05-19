// Firebase configuration...
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getFirestore, addDoc, collection, query, where, getDocs } from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js';
import { getAuth, createUserWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js';

// Firebase configuration
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
//For Auth
const auth = getAuth(app);
// Access Firestore
const db = getFirestore(app);

// Retrieve branch manager ID from session storage
const BMID = sessionStorage.getItem('sessionID');

// Redirect to login page if branch manager ID is not available
if (!BMID) {
    window.location.href = "login.html";
}

document.addEventListener('DOMContentLoaded', function () {
    // Reset form fields when the page loads
    resetForm();

    const employeeRegistrationForm = document.getElementById('registrationForm2');
    const errorMessageElement = document.getElementById('errorMessage');
    const successMessageElement = document.getElementById('successMessage');
    const cancelButton = document.getElementById('cancel');
    const pleaseWaitMessage = document.getElementById('pleaseWaitMessage');

    cancelButton.addEventListener('click', function() {
        // Redirect to home page
        window.location.href = "homepagePM.html";
    });

    employeeRegistrationForm.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent default form submission
        Add();
    });

    async function Add() {
        try {
            // Extract form data
            const firstName = document.getElementById("FirstName").value;
            const lastName = document.getElementById("LastName").value;
            const email = document.getElementById("email").value;
            const phone = document.getElementById("phone").value;
            const yearsExperience = document.getElementById("years_experience").value;

            // Validate email format
            if (!isValidEmail(email)) {
                displayErrorMessage("Please enter a valid email address.");
                return;
            }

            // Validate phone number
            if (!isValidPhoneNumber(document.getElementById("phone"))) {
                displayErrorMessage("Phone number must contain exactly ten digits.");
                return;
            }

            // Add The Employee In Firebase Authentication
            const userCredential = await createUserWithEmailAndPassword(auth, email, '000000');
            const uid = userCredential.user.uid;

            // Add employee to the Firestore collection
            const stationRequestRef = await addDoc(collection(db, "Station_Employee"), {
                firstName: firstName,
                lastName: lastName,
                email: email,
                branch_manager_id: BMID,
                phone: phone,
                years_experience: yearsExperience,
                uid: uid,
            });

            // Display success message and reset form
            displaySuccessMessage();
            resetForm();

            // Redirect after 2 seconds
            setTimeout(() => {
                window.location.href = "myEmployee.html";
            }, 2000);

            // Hide "please wait" message after successful submission
            pleaseWaitMessage.style.display = "none";

        } catch (error) {
            console.error("An error occurred during form submission:", error);
            // Check if the error is due to email-already-in-use
            if (error.code === "auth/email-already-in-use") {
                displayErrorMessage("Email address is already in use. Please use a different email.");
            } else {
                displayErrorMessage("An error occurred. Please try again later.");
            }
            // Show "please wait" message after displaying error message
            pleaseWaitMessage.style.display = "block";
        }
    }

    function displayErrorMessage(message) {
        errorMessageElement.textContent = message;
        successMessageElement.style.display = "none";
    }

    function displaySuccessMessage() {
        errorMessageElement.textContent = "";
        successMessageElement.style.display = "block";
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function isValidPhoneNumber(phoneInput) {
        const phoneNumber = phoneInput.value;
        return /^\d{10}$/.test(phoneNumber);
    }

    function resetForm() {
        // Reset all form fields
        document.getElementById('FirstName').value = '';
        document.getElementById('LastName').value = '';
        document.getElementById('email').value = '';
        document.getElementById('phone').value = '';
        document.getElementById('years_experience').value = '';
    }
});
