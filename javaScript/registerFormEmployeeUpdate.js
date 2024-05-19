import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getFirestore, doc, updateDoc, query, where, getDoc, getDocs, collection } from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js';

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

// Specify the correct name of the collection for employees
const employeeCollectionName = "Station_Employee";

document.addEventListener("DOMContentLoaded", async function () {

    // Retrieve query parameters from the URL
    const urlParams = new URLSearchParams(window.location.search);

    // Get values from query parameters
    const firstName = urlParams.get("FirstName");
    const lastName = urlParams.get("LastName");
    const email = urlParams.get("email");
    const phone= urlParams.get("phone");
    const years_experience= urlParams.get("years_experience");
    const employeeId = urlParams.get("employeeId"); // Add this line to get the employeeId

    // Set values to form fields
    document.getElementById("FirstName").value = firstName;
    document.getElementById("LastName").value = lastName;
    document.getElementById("Email").value = email;
    document.getElementById("phone").value = phone;
    document.getElementById("years_experience").value = years_experience;
    document.getElementById("cancel").addEventListener("click", function () {
        // Construct the URL with query parameters for the bill details page
        const url = `myemployee.html`;
    
        // Redirect to the bill details page with query parameters
        window.location.href = url;
    });


    

    document.getElementById("registrationForm").addEventListener("submit", async function (event) {
        event.preventDefault(); // Prevent the default form submission behavior
         // Display wait message
    displayPleaseWaitMessage();
        // Reset all error messages
        resetErrorMessages();

        // Validate and get the phone number
    const phoneInput = document.getElementById("phone");
    const phone = phoneInput.value.trim(); // Trim leading and trailing whitespaces

    if (!isValidPhone(phone)) {
        const phoneError6 = document.getElementById("PhoneError6");
        if (phoneError6) {

            phoneError6.innerText = 'Phone number must have exactly ten digits';
            phoneError6.style.color = 'red';
            phoneError6.style.fontSize = '10px';
        }
             // Hide wait message when displaying an error
            hidePleaseWaitMessage();
        return;
    } else {
        // Phone number is valid, display a success message
        setSuccess(phoneInput);
    }

         // Validate and get the email
    const emailInput = document.getElementById("Email");
    const email = emailInput.value.trim(); // Trim leading and trailing whitespaces

    if (!isValidEmail(email)) {
        const EmailError4 = document.getElementById("EmailError4");
        if (EmailError4) {
            EmailError4.innerText = 'Incorrect Email';
            EmailError4.style.color = 'red';
            EmailError4.style.fontSize = '10px';
        }
            // Hide wait message when displaying an error
            hidePleaseWaitMessage();
        return;
    } else {
        // Email is valid, display a success message
        setSuccess(emailInput);
    }
        // Check if the provided email is already in use by another user

    // Check if the email is different from the current email
    const currentEmail = await getCurrentEmail(employeeId);
    if (currentEmail !== email) {
        // Check if the provided email is already in use by another user
        const isEmailUsed = await isEmailAlreadyUsed(email, employeeId);

        if (isEmailUsed) {
            const EmailError5 = document.getElementById("EmailError5");
            if (EmailError5) {
                EmailError5.innerText = 'Email is already in use';
                EmailError5.style.color = 'red';
                EmailError5.style.fontSize = '10px';
            }
        // Hide wait message when displaying an error
        hidePleaseWaitMessage();
            return;
        }
    }


        // Retrieve the current employee document from Firestore
    const employeeDocRef = doc(db, employeeCollectionName, employeeId);
    const employeeDoc = await getDoc(employeeDocRef);

    //
    //const currentPassword = employeeDoc.data().password;
    // const enteredPrevPasswordInput = document.getElementById("PrevPassword");

    // if (!enteredPrevPasswordInput) {
    //     console.error("Password input not found.");
    //     return;
    // }


    // let enteredPrevPassword = "";  // Initialize as an empty string

    // // Check if the user is updating the password
    //     if (click_to_change_password === 1) {
    //         // User is updating the password, get the value from the input field
    //         enteredPrevPassword = enteredPrevPasswordInput.value;

    //         // Trim leading and trailing whitespaces, if any
    //         enteredPrevPassword = enteredPrevPassword.trim();
    // }

    // // Validate the previous password if it's not empty
    // if (click_to_change_password === 1 && enteredPrevPassword !== "") {
    //     // Hash the entered password using the same SHA-256 algorithm
    //     const hashedEnteredPrevPassword = await hashPassword(enteredPrevPassword);

    //     // Validate the previous password
    //     if (hashedEnteredPrevPassword !== currentPassword) {
    //         const passwordError1 = document.getElementById("passwordError1");
    //         if (passwordError1) {
    //             passwordError1.innerText = 'Incorrect previous password';
    //             passwordError1.style.color = 'red';
    //             passwordError1.style.fontSize = '10px';
    //         }
    //         // Hide wait message when displaying an error
    //         hidePleaseWaitMessage();
    //         return;
    //     } else {
    //         setSuccess(enteredPrevPasswordInput);
    //     }
    // }

    //     // Validate and get the new password
    //     const newPasswordInput = document.getElementById("New_Password");
    //     const newPassword = newPasswordInput.value.trim(); // Trim leading and trailing whitespaces

    //     if (click_to_change_password === 1 && newPassword !== "") {
    //         // User is updating the password, validate the new password
    //         if (!isValidPassword(newPassword)) {
    //             const passwordError2 = document.getElementById("passwordError2");
    //             if (passwordError2) {
    //                 passwordError2.innerText = 'Password must length 8 and contain at least one digit, one special character, one uppercase letter, and one lowercase letter.';
    //                 passwordError2.style.color = 'red';
    //                 passwordError2.style.fontSize = '10px';
    //             }
    //              // Hide wait message when displaying an error
    //     hidePleaseWaitMessage();
    //             return;
    //         } else {
    //             setSuccess(newPasswordInput);
    //         }
    //           // Hash the new password before updating the data
    //       hash_new_password = await hashPassword(newPassword); 
    //     }

    //     // Validate and get the confirmation password
    //     const confirmNewPasswordInput = document.getElementById("Re_Password");
    //     const confirmNewPassword = confirmNewPasswordInput.value.trim(); // Trim leading and trailing whitespaces

    //     if (click_to_change_password === 1 && confirmNewPassword !== newPassword) {
    //         // User is updating the password, validate the confirmation password
    //         const passwordError3 = document.getElementById("passwordError3");
    //         if (passwordError3) {
    //             passwordError3.innerText = 'Not match New Password';
    //             passwordError3.style.color = 'red';
    //             passwordError3.style.fontSize = '10px';
    //         }
    //      // Hide wait message when displaying an error
    //     hidePleaseWaitMessage();
    //         return;
    //     } else {
    //         setSuccess(confirmNewPasswordInput);
 
    //     }
        // Validate the email

   
        
        // Update the document in the Firestore collection using the employeeId
        const updatedData = {
            firstName: document.getElementById("FirstName").value,
            lastName: document.getElementById("LastName").value,
            email: document.getElementById("Email").value,
            phone: document.getElementById("phone").value,
            years_experience: document.getElementById("years_experience").value,
            //password:currentPassword,
        };




        // Use updateDoc from Firestore SDK to update the document
        updateDoc(employeeDocRef, updatedData)
        .then(() => {
              // Hide wait message
            hidePleaseWaitMessage();
            // Display success message at the end of the form
            const successMessage = document.getElementById("successMessage");
            if (successMessage) {
                successMessage.style.display = "block";
        
                // Wait for 1.5 seconds
                setTimeout(() => {
                    // Redirect to employee.html after 1.5 seconds
                    window.location.href = "myEmployee.html";
                }, 1500);
            }
        })
            .catch((error) => {
                hidePleaseWaitMessage();
                console.error("Error updating document: ", error);
            });

            
    });
});



//--------Method For Validation And error massege ---------


const resetErrorMessages = () => {
    // Reset error messages for previous password
    const passwordError1 = document.getElementById("passwordError1");
    resetErrorMessage(passwordError1);

    // Reset error messages for new password
    const passwordError2 = document.getElementById("passwordError2");
    resetErrorMessage(passwordError2);

    // Reset error messages for confirm password
    const passwordError3 = document.getElementById("passwordError3");
    resetErrorMessage(passwordError3);

      // Reset error messages for confirm password
      const EmailError4 = document.getElementById("EmailError4");
      resetErrorMessage(EmailError4);
      // Reset error messages for confirm password
      const EmailError5 = document.getElementById("EmailError5");
      resetErrorMessage(EmailError5);
        // Reset error messages for confirm password
        const phoneError6 = document.getElementById("PhoneError6");
        resetErrorMessage(phoneError6);
};

const resetErrorMessage = (element) => {
    if (element) {
        element.innerText = '';
        element.style.color = '';
        element.style.fontSize = '';

        // Reset the parent element's classes
        const inputControl = element.parentElement;
        if (inputControl) {
            inputControl.classList.remove('error');
            inputControl.classList.remove('success');
        }
    }
};



const setSuccess = element => {
    const inputControl = element.parentElement;
    if (inputControl) {
        const errorDisplay = inputControl.querySelector('.error');
        if (errorDisplay) {
            errorDisplay.innerText = '';
            errorDisplay.style.color = '';  // Reset color
            errorDisplay.style.fontSize = '';  // Reset font size
            inputControl.classList.add('success');
            inputControl.classList.remove('error');
        }
    }
};





function isValidEmail(email) {
    // Use a regular expression to validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Function to check if the provided email is already in use by another user
async function isEmailAlreadyUsed(email, currentEmployeeId) {
    // Create a query to check if the email is already used by another user
    const employeeQuery = query(collection(db, employeeCollectionName), where("email", "==", email));

    const querySnapshot = await getDocs(employeeQuery);

    // Check if there are any documents other than the current user with the same email
    return querySnapshot.docs.some(doc => doc.id !== currentEmployeeId);
}

// Function to get the current email of the employee
async function getCurrentEmail(employeeId) {
    const employeeDocRef = doc(db, employeeCollectionName, employeeId);
    const employeeDoc = await getDoc(employeeDocRef);
    return employeeDoc.data().email;
}
    function isValidPhone(phone) {
        // Phone number must contain exactly ten digits
        const phoneRegex = /^\d{10}$/;
        return phoneRegex.test(phone);
    }
    const displayPleaseWaitMessage = () => {
        const pleaseWaitMessage = document.getElementById("pleaseWaitMessage");
        if (pleaseWaitMessage) {
            pleaseWaitMessage.style.display = "block";
            pleaseWaitMessage.innerText = 'Please wait, checking input...';
        }
    };
    const hidePleaseWaitMessage = () => {
        const pleaseWaitMessage = document.getElementById("pleaseWaitMessage");
        if (pleaseWaitMessage) {
            pleaseWaitMessage.style.display = "none";
            pleaseWaitMessage.innerText = '';
        }
    };

