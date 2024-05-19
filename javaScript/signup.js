import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc, query, where } from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js';
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";

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
const auth = getAuth();

// const collectionName = "branchManager"; // Firestore collection for user registration data
const collectionName = "Branch_Manager";

let emailExists = false;


// Function to register a user with Firebase Authentication
async function registerUser(email, password) {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        // console.log("userCredential: " + userCredential.user);
        return userCredential.user;
    } catch (error) {
        // console.log("error occured in async function registerUser(email, password)");
        console.log(error);
        return null;
        //throw error;
    }
}

// Function to add user registration data to Firestore
async function addUserToFirestore(firstName, lastName, email, password) {
    const collectionRef = collection(db, collectionName);

    const userData = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password, // Include the user's password if needed
    };

    try {
        const doctRef = await addDoc(collectionRef, userData);
        const branchManagerId = doctRef.id;
        // console.log("Branch Manager ID: " + branchManagerId);
        sessionStorage.setItem("branchManagerID", branchManagerId);

    } catch (error) {
        // console.log("error occured in async function addUserToFirestore(firstName, lastName, email, password)");
        console.log(error.toString);
        throw error;
    }
}

document.getElementById("signup-form").addEventListener("submit", async function (event) {
    event.preventDefault();

    var inputValidated = validateInputs();
    if (inputValidated) {

        const firstName = document.getElementById("first-name").value;
        const lastName = document.getElementById("last-name").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        try {
            // Check if the email already exists (You may have a separate function for this)
            // If the email exists, display an error message to the user

            // If the email doesn't exist, register the user with Firebase Authentication
            const hashedPassword = await hashPassword(password);
            const user = await registerUser(email, password);
            // console.log("user after register user: " + user);

            // Check if the email already exists
            const emailExists = await checkEmailExists(email);
            if (emailExists) {
                // If the email exists, show a confirmation dialog to change the email
                
                showAlert('Email is already in use do you want to change it?');
                const changeEmail = true;
                if (changeEmail) {
                    document.getElementById("email").value = ' ';// Clear the email error message
                    setError(email, ' ');
                    // Allow the user to edit the email and proceed with the registration
                } else {
                    return; // Exit registration process if the user chooses not to change the email
                }
            }

            if (user != null) {
                // console.log("User registered:", user);

                // Add user registration data to Firestore
                await addUserToFirestore(firstName, lastName, email, hashedPassword);


                // Reset the form and provide a success message
                document.getElementById("signup-form").reset();
                showAlert("Thank you for registering!");

                // Redirect after a certain delay
                setTimeout(function () {
                    window.location.href = "registerFormBM.html";
                }, 3000); // Redirect after 3 seconds
                // await checkRequests(email);
            }
            else {
                // console.log("User is null, else entered");
                setError(document.getElementById("email"), "Email is already in use, please log in");
                emailExists = true;
            }
        } catch (error) {
            //  alert("Email is already in use, please log in")
            setError(document.getElementById("email"), "Email is already in use, please log in");

            console.error("Error during registration: ", error);
        }
    }

});

// Function to check if the email already exists
async function checkEmailExists(email) {
    const collectionRef = collection(db, collectionName);

    try {
        const querySnapshot = await getDocs(query(collectionRef, where("email", "==", email))); // Use query() function
        return !querySnapshot.empty; // Returns true if email exists, false otherwise
    } catch (error) {
        console.error("Error checking email existence: ", error);
        return false; // Return false by default in case of an error
    }
}

async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
    // console.log('Hashed Password (SHA-256): ' + hashHex);
    return hashHex.toString();
    // Store 'hashHex' in your database
}

// =================================================================
// Form validation

// const form = document.getElementById('signup-form');
const firstName = document.getElementById("first-name");
const lastName = document.getElementById("last-name");
const email = document.getElementById('email');
const password = document.getElementById('password');
const password2 = document.getElementById('confirm_password');

// form.addEventListener('submit', e => {
//     e.preventDefault();

//     validateInputs();
// });




const setError = (element, message) => {
    const inputControl = element.parentElement;
    const errorDisplay = inputControl.querySelector('.error');

    errorDisplay.innerText = message;
    inputControl.classList.add('error');
    inputControl.classList.remove('success')
}

const setSuccess = element => {
    const inputControl = element.parentElement;
    const errorDisplay = inputControl.querySelector('.error');

    errorDisplay.innerText = '';
    inputControl.classList.add('success');
    inputControl.classList.remove('error');
};

const isValidEmail = email => {
    const regx = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regx.test(String(email).toLowerCase());
}


const validateInputs = () => {
    var success1 = false;
    var success2 = false;
    var success3 = false;
    var success4 = false;
    var success5 = false;
    const firstNameValue = firstName.value.trim();
    const lastNameValue = lastName.value.trim();
    const emailValue = email.value.trim();
    const passwordValue = password.value.trim();
    const password2Value = password2.value.trim();


    // Regular expressions to match different password criteria
    const lowerCaseRegex = /[a-z]/;
    const upperCaseRegex = /[A-Z]/;
    const digitRegex = /\d/;
    const specialCharRegex = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]/;


    // Check if all criteria are met
    const allCriteriaMet =
        lowerCaseRegex.test(passwordValue) &&
        upperCaseRegex.test(passwordValue) &&
        digitRegex.test(passwordValue) &&
        specialCharRegex.test(passwordValue);

    if (firstNameValue === '') {
        setError(firstName, 'first name is required');
        success1 = false;
    } else {
        setSuccess(firstName);
        success1 = true;

    }

    if (lastNameValue === '') {
        setError(lastName, 'last name is required');
        success5 = false;
    } else {
        setSuccess(lastName);
        success5 = true;

    }

    if (emailValue === '') {
        setError(email, 'Email is required');
        success2 = false;
    } else if (!isValidEmail(emailValue)) {
        setError(email, 'Provide a valid email address');
        success2 = false;
    } else if (emailExists) {
        setError(email, 'Email is already in use, please log in');
        success2 = false;
    } else {
        setSuccess(email);
        success2 = true;
    }

    if (passwordValue === '') {
        setError(password, 'Password is required');
        success3 = false;
    // } 
    // else if (passwordValue.length < 8) {
    //     setError(password, 'Password must be at least 8 character.')
    //     success3 = false;
    } else if(!allCriteriaMet) {
        setError(password, 'Password should include at least one digit, one lowercase and one uppercase letter, and one special character, with a minimum of 8 characters.')
        success3 = false;
    }
    else {
        setSuccess(password);
        success3 = true;
    }

    if (password2Value === '') {
        setError(password2, 'Please confirm your password');
        success4 = false;
    } else if (password2Value !== passwordValue) {
        setError(password2, "Passwords doesn't match");
        success4 = false;
    } else {
        setSuccess(password2);
        success4 = true;
    }

    return success1 && success2 && success3 && success4 && success5;


};

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
