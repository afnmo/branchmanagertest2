import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getFirestore, getDoc, query, where, doc, updateDoc, addDoc,getDocs, collection, deleteDoc } from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js';

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
const collectionName = "Station_Requests";

//retrieve stationID
const SID = sessionStorage.getItem('branchManagerID');

const sessionID = sessionStorage.getItem('sessionID');

function showToast(message) {
    // Create a toast element
    const toastElement = document.createElement('div');
    toastElement.className = 'toast d-flex align-items-center text-white bg-primary border-0 justify-content-between';
    toastElement.role = 'alert';
    toastElement.setAttribute('aria-live', 'assertive');
    toastElement.setAttribute('aria-atomic', 'true');

    toastElement.style.backgroundColor = '#30b476'; 

    // Create the toast body
    const toastBody = document.createElement('div');
    toastBody.className = 'toast-body';
    toastBody.textContent = message;

    // Create a close button
    const closeButton = document.createElement('button');
    closeButton.type = 'button';
    closeButton.className = 'btn-close';
    closeButton.setAttribute('aria-label', 'Close');
    closeButton.addEventListener('click', function() {
        // Hide the toast when close button is clicked
        toastElement.style.display = 'none';
    });

    // Append the close button and body to the toast
    toastElement.appendChild(toastBody);
    toastElement.appendChild(closeButton);

    // Append the toast to the toast container
    const toastContainer = document.getElementById('toast-container');
    toastContainer.appendChild(toastElement);

    // Show the toast
    toastElement.style.display = 'block';

    // Automatically hide the toast after a certain duration (e.g., 5 seconds)
    // Automatically hide the toast after a certain duration (e.g., 5 seconds)
setTimeout(function() {
    toastElement.style.opacity = '0'; // Fade out the toast
    setTimeout(function() {
        toastContainer.removeChild(toastElement); // Remove the toast from the DOM
    }, 500); // Adjust the duration as needed to match the CSS transition
}, 5000); // Adjust the duration as needed

}


async function chechRejected(){
    console.log("chechRejected() entered");
try {
    // Retrieve the branchManagerID from sessionStorage
    // const SID = sessionStorage.getItem('branchManagerID');

    // Create a reference to the Station_Requests collection
    const stationRequestsRef = collection(db, 'Station_Requests');

    console.log("sessionID" + sessionID);
    // Query for documents where branch_manager_id matches SID
    const querySnapshot = await getDocs(query(stationRequestsRef, where('branch_manager_id', '==', sessionID)));
    // console.log(querySnapshot);

    querySnapshot.forEach(async (doc) => {
        // Extract the value of the 'accepted' field from each document
        const acceptedValue = doc.data().accepted;

        // Check the value of the 'accepted' field
        if (acceptedValue === 'declined') {
            // Get the requestId
            const requestId = doc.id;

            // Call the updateRequestStatus function with appropriate message
            // Provide feedback to the user
            const message = "Your station registration request has been declined by admin. You can register again or contact admin for further details: admin@91.com."

            // Show a toast notification to the user
            showToast(message);

            // await updateRequestStatus(requestId, false, "");
            await deleteDoc(doc.ref);
        }
    });
} catch (error) {
    // Handle errors
    console.error("Error handling database operation:", error);
}
}

if (sessionID) {
    chechRejected();
    const Sdoc = doc(db, "Branch_Manager", sessionID); // Update the document reference
    // Use await with getDoc since it returns a Promise
    const docSnap = await getDoc(Sdoc);

    if (docSnap.exists()) {
        const SData = docSnap.data();
        
        // document.getElementById("FirstName").value = SData.first_name;
        // document.getElementById("LastName").value = SData.last_name;
        document.getElementById("FirstName").value = SData.firstName;
        document.getElementById("LastName").value = SData.lastName;
        document.getElementById("Email").value = SData.email;

        document.getElementById("FirstName").style.fontSize = "larger";
        document.getElementById("LastName").style.fontSize = "larger";
        document.getElementById("Email").style.fontSize = "larger";
        document.getElementById("FirstName").style.color = "#30b476";
        document.getElementById("LastName").style.color = "#30b476";
        document.getElementById("Email").style.color = "#30b476";

    }
} else {
    window.location.href = "signup.html";
}


// if(sessionID){
//     console.log("sessionID true");
// chechRejected();
// }
// else{
//     console.log("sessionID false");
// }
const urlInput = document.getElementById("GoogleMapUrl");
const urlError = document.getElementById("urlError");

async function Addrequests() {
    const stationName = document.getElementById("StationName").value;
    const stationLocation = document.getElementById("GoogleMapUrl").value;
    // Get today's date in the format "dd/mm/yyyy"
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
    const yyyy = today.getFullYear();
    const requestDate = dd + '/' + mm + '/' + yyyy;
  
    
        const isValidURL = validateURL(stationLocation);

        if (!isValidURL || stationLocation.trim() === '') {
            urlError.textContent = "Location must be in Google Maps URL format";
            urlInput.classList.add('error');
            return; // Stop further execution
        }
 
    
    try {


        // Add to the "Station_Requests" collection
        const stationRequestRef = await addDoc(collection(db, "Station_Requests"), {
            name: stationName,
            location: stationLocation,
            branch_manager_id: sessionID, 
            accepted: "pending", //'pending',
            requestDate: requestDate
        });        

        // Get the ID of the newly created "Branch_Manager" document
        const stationRequestID = stationRequestRef.id;

        // Define a reference to a specific document within the "Branch_Manager" collection
        const branchManagerDocRef = doc(db, "Branch_Manager", sessionID);

        // Update the document with the new field
        // updateDoc(branchManagerDocRef, {
        //     station_request_id: stationRequestID,
        // });

        // Document updated successfully
        document.getElementById("registrationForm").reset();
        // window.location.href = "login.html";
        window.location.href = "waitApproval.html";
    } catch (error) {
        console.error("Error updating document:", error);
    }
      
}

document.getElementById("registrationForm").addEventListener("submit", async function (event) {
    event.preventDefault();

        await Addrequests();
});

function validateURL(url) {
    const urlPattern = /^https:\/\/maps\.app\.goo\.gl\/.*$/;

    const isValidURL = urlPattern.test(url);

    if (!isValidURL) {
        urlError.textContent = "Location must be in the format 'https://maps.app.goo.gl/'";
        urlInput.classList.add('error');
    } else {
        urlError.textContent = "";
        urlInput.classList.remove('error');
    }

    return isValidURL;
}