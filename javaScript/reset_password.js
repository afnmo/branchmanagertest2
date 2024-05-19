
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js';
import {getAuth, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";


// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAWSHSS6v0pG5VxrmfXElArcMpjBT5o6hg",
    authDomain: "app-be149.firebaseapp.com",
    projectId: "app-be149",
    storageBucket: "app-be149.appspot.com",
    messagingSenderId: "18569998394",
    appId: "1:18569998394:web:c8efa4c8b656702c1cc503"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth();


// Get references to form and input elements
const resetPasswordForm = document.getElementById("reset-password-form");
const emailInput = document.getElementById("email");
const countdown = document.getElementById("countdown");
const timer = document.getElementById("timer");
const sendButton = document.getElementById("send");

// Define a variable to keep track of the countdown time
let countdownTime = 30; // 30 seconds

resetPasswordForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const emailAddress = emailInput.value;

  sendPasswordResetEmail(auth, emailAddress)
    .then(() => {
      // Password reset email sent successfully
      sendButton.disabled = true;
      countdown.style.display = "block"; // Show the countdown timer
      startCountdown(); // Start the countdown timer
    })
    .catch((error) => {
      // Handle errors
      console.error("Error sending password reset email: " + error.message);
      showAlert("Password reset email could not be sent. Check your email address.");
    });

  // Clear the input field
  emailInput.value = "";
});

function startCountdown() {
  const countdownInterval = setInterval(function () {
    countdownTime--;
    timer.textContent = countdownTime;

    if (countdownTime === 0) {
      clearInterval(countdownInterval);
      sendButton.disabled = false;
      countdown.style.display = "none"; // Hide the countdown timer
      countdownTime = 30; // Reset the countdown time for future use
    }
  }, 1000); // Update every second

}


// change alert style
function showAlert(message) {
  var overlay = document.createElement('div');
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
  overlay.style.display = 'flex';
  overlay.style.alignItems = 'center';
  overlay.style.justifyContent = 'center';
  overlay.style.zIndex = '9999';

  var customAlert = document.createElement('div');
  customAlert.style.backgroundColor = '#fff';
  customAlert.style.padding = '20px';
  customAlert.style.border = '1px solid #ccc';
  customAlert.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.2)';
  customAlert.style.textAlign = 'center';
  customAlert.style.display = 'flex';
  customAlert.style.flexDirection = 'column'; // Align items in a column

  var header = document.createElement('div');
  header.style.display = 'flex';
  header.style.alignItems = 'center';
  header.style.marginBottom = '10px'; // Spacing between header and message

  var imgElement = document.createElement('img');
  imgElement.src = '../images/logo_no_bkg.png'; // Add your image path here
  imgElement.style.width = '50px';
  imgElement.style.marginRight = '10px'; // Space between image and text

  var headerText = document.createElement('span');
  headerText.textContent = '91 Website'; // Your header text
  headerText.style.color = '#000';

  var messageElement = document.createElement('span');
  messageElement.textContent = message;
  messageElement.style.color = '#000';

  var closeButton = document.createElement('button');
  closeButton.textContent = 'OK';
  closeButton.style.padding = '3px 8px'; // Adjust button size
  closeButton.style.cursor = 'pointer';
  closeButton.style.border = 'none';
  closeButton.style.backgroundColor = 'rgba(248, 167, 26)';
  closeButton.style.color = '#fff';
  closeButton.style.marginTop = '10px';
  closeButton.style.alignSelf = 'flex-end'; // Align button to the right

  closeButton.addEventListener('click', function () {
    document.body.removeChild(overlay);
  });

  header.appendChild(imgElement);
  header.appendChild(headerText);
  customAlert.appendChild(header);
  customAlert.appendChild(messageElement);
  customAlert.appendChild(closeButton);
  overlay.appendChild(customAlert);
  document.body.appendChild(overlay);
}