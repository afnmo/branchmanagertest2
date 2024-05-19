// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getFirestore, doc, getDoc, updateDoc, collection } from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js';

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
const collectionName = "Station";

let stationID;

//retrieve stationID
const BMID = sessionStorage.getItem('sessionID');
if (BMID) {
    const BMdoc = doc(db, "Branch_Manager", BMID); // Update the document reference

    // Use await with getDoc since it returns a Promise
    const docSnap = await getDoc(BMdoc);

    if (docSnap.exists()) {
        const BMData = docSnap.data();
        stationID = BMData.station_id;
    }

} else {
    window.location.href = "login.html";
}

// Create a reference to the collection
const collectionRef = collection(db, collectionName);

// Retrieve a specific document by ID ("s1") must tack id from BM fk ************************
const documentPath = doc(collectionRef, stationID);

// let serivceArray;

// Retrieve station data and populate form fields
async function retrieveAndPopulateForm() {
    try {
        const docSnap = await getDoc(documentPath);
        if (docSnap.exists()) {
            // Access data for each document
            const stationData = docSnap.data();

            if (stationData.services != null) {
                // Retrieve the last stored height value from localStorage
                let heightRetrive = localStorage.getItem("imageHeightRetrive") || 1000;

                const requiredServices = ["Convenience Store", "ATM", "Car Wash", "Car Mechanic", "Mosque", "Restrooms"];

                let oneService = false;
                // serivceArray = stationData.services;

                // Iterate over each service in the array
                for (let i = 0; i < stationData.services.length; i++) {
                    const serviceName = stationData.services[i];
                    if (requiredServices.includes(serviceName)) {
                        const checkbox = document.getElementById(`service${serviceName}`);
                        if (checkbox) {
                            checkbox.checked = true;
                        }
                    } else {
                        createInputFields(serviceName, i); // Call your function to create input fields
                        const checkbox = document.getElementById(`other`);
                        if (checkbox) {
                            checkbox.checked = true;
                            document.getElementById("ownServices").style.display = 'block';
                        }
                        oneService = true;
                    }
                    heightRetrive = parseInt(heightRetrive) + 80;
                }

                if (oneService) {
                    const servicesSpan = document.getElementById('serviceText');
                    if (servicesSpan) {
                        servicesSpan.remove();
                    }
                }

                // Set the final height after processing all services
                document.getElementById("BKimage").height = heightRetrive;

                // Store the updated height value in localStorage
                localStorage.setItem("imageHeightRetrive", heightRetrive);
            }

        } else {
            console.log("Document does not exist.");
        }
    } catch (error) {
        console.error("Error reading document: ", error);
    }
}

const form = document.getElementById("editServices");

form.addEventListener("submit", async function (event) {
    event.preventDefault();

    // Check if at least one checkbox is checked or if at least one service is added in the input field
    const checkboxesChecked = document.querySelectorAll('input[name="service"]:checked');
    const inputFields = document.querySelectorAll('input[name="stationServies"]');

    if (checkboxesChecked.length > 0 || inputFields.length > 0) {
        // If at least one service is present, proceed to update the station
        await updateStation();
        window.location.href = "homepagePM.html";
    } else {
        // If no services are present, display an error message or handle the case accordingly
        showAlert("At least one service must be present");
    }
});

retrieveAndPopulateForm();

// update to station doc
async function updateStation() {
    const serviceChecked = document.getElementsByName("service");

    for (let i = 0; i < serviceChecked.length; i++) {
        if (serviceChecked[i].checked) {
            formServiceArray.push(serviceChecked[i].value);
        }
    }
    // Update the station with more information
    try {
        await updateDoc(documentPath, {
            services: formServiceArray,
        });
        console.log("Data successfully updated in Firestore.");
    } catch (error) {
        console.error("Error updating data in Firestore: ", error);
    }
}

// Get the container element
const servicesContainer = document.getElementById('servicesContainer');
let formServiceArray = [];

// Function to create input fields based on services data
function createInputFields(serviceName, index) {
    // Create a new container div for each pair
    const containerDiv = document.createElement('div');
    containerDiv.style = 'display: flex; align-items: center;'; // Set display property to flex

    // Create a new input element
    const newInput = document.createElement('input');
    newInput.className = 'form-control form-control-user';
    newInput.type = 'text';
    newInput.style = 'color: #4F4F4F; font-weight: 500; margin: 5px; font-size: 18px; width: 460px;';
    newInput.name = 'stationServies';
    newInput.placeholder = 'Edit your station services';
    newInput.value = serviceName; // Set the value from the Firebase data
    newInput.required = true;

    // Create a new button element
    const newButton = document.createElement('button');
    newButton.type = 'button';
    newButton.className = 'add-button';
    newButton.style = 'border: 2px solid #E74A3B; border-radius: 45%; background-color: white; height: 35px; width: 35px;';

    // Create a new icon element
    const newIcon = document.createElement('i');
    newIcon.className = 'fas fa-trash-alt'; // Font Awesome delete icon
    // Add a style to set the color to red
    newIcon.style.color = '#E74A3B';

    // Append the icon to the button
    newButton.appendChild(newIcon);

    // Append the input and button to the container div
    containerDiv.appendChild(newInput);
    containerDiv.appendChild(newButton);


    // Store the initial value when the input field is created
    formServiceArray[index] = newInput.value.trim();

    let sheckIndex = true;
    // Define the input event handler function
    function handleServiceInput() {
        // Get the trimmed value of the input field
        const updatedServiceName = newInput.value.trim();

        // Update the array with the new value at the same index
        if (index < formServiceArray.length) {
            formServiceArray[index] = updatedServiceName;
        } else {
            if (sheckIndex) {
                index--;
                sheckIndex = false;
            }
        }
    }

    // Add an event listener to the input field for changes
    newInput.addEventListener('input', handleServiceInput);

    // Add an event listener to the delete button
    newButton.addEventListener('click', async function () {
        // Check if there's only one service left
        // if (formServiceArray.length === 1) {
        //     // Display a message indicating that at least one service must be present
        //     showAlert("At least one service must be present");
        //     return; // Exit the function, preventing deletion
        // }

        showConfirm(
            'Are you sure you want to delete this service?',
            async function () {
                // Remove the input event listener
                newInput.removeEventListener('input', handleServiceInput);
                // Remove the corresponding entry from the array
                formServiceArray.splice(index, 1);

                // Remove the container div from the main container
                servicesContainer.removeChild(containerDiv);

                // await updateStation();
                console.log('User confirmed.');
            },
            function () {
                // Code to execute on cancel
                console.log('User canceled.');
            }
        );
    });

    // Append the container div to the main container
    servicesContainer.appendChild(containerDiv);
}

let height = localStorage.getItem("imageHeightRetrive") || 1100;

const otherServices = document.getElementById("other");
otherServices.addEventListener("click", async function (event) {
    document.getElementById("ownServices").style.display = 'block';
});

const serviceButton = document.getElementById("stationServiesButton");
serviceButton.addEventListener("click", async function (event) {
    const servicesSpan = document.getElementById('serviceText');
    if (servicesSpan) {
        servicesSpan.remove();
    }
    addServiceField();

    document.getElementById("BKimage").height = height;
    height = parseInt(height) + 100;

    // Store the updated height value in localStorage
    localStorage.setItem("imageHeight", height);
});
localStorage.removeItem("imageHeight");
localStorage.removeItem("imageHeightRetrive");

async function addServiceField() {
    const stationServicesSpan = document.getElementById('stationServies');
    if (stationServicesSpan) {
        stationServicesSpan.remove();
    }

    let index = formServiceArray.length;

    // Create a new container div for each pair
    const containerDiv = document.createElement('div');
    containerDiv.style = 'display: flex; align-items: center;'; // Set display property to flex

    // Create a new input element
    const newInput = document.createElement('input');
    newInput.className = 'form-control form-control-user';
    newInput.type = 'text';
    newInput.style = 'color: #4F4F4F; font-weight: 500; margin: 5px; font-size: 18px; width: 460px;';
    newInput.name = 'stationServies';
    newInput.placeholder = 'Add your station services';
    newInput.required = true;

    document.getElementById("BKimage").height = 1050;

    containerDiv.appendChild(newInput);

    // Store the initial value when the input field is created
    formServiceArray[index] = '';


    // Add an event listener to the input field for changes
    newInput.addEventListener('input', function () {
        // Get the trimmed value of the input field
        const updatedServiceName = newInput.value.trim();

        // Update the array with the new value
        formServiceArray[index] = updatedServiceName;
    });

    // Append the container div to the main container
    servicesContainer.appendChild(containerDiv);
}


function showConfirm(message, onConfirm, onCancel) {
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

    var confirmButton = document.createElement('button');
    confirmButton.textContent = 'OK';
    confirmButton.style.padding = '3px 130px'; // Adjust button size
    confirmButton.style.cursor = 'pointer';
    confirmButton.style.border = 'none';
    confirmButton.style.backgroundColor = 'red'; // Green color for confirm
    confirmButton.style.color = '#fff';
    confirmButton.style.marginTop = '10px';


    confirmButton.addEventListener('click', function () {
        document.body.removeChild(overlay);
        if (typeof onConfirm === 'function') {
            onConfirm();
        }
    });

    var cancelButton = document.createElement('button');
    cancelButton.textContent = 'Cancel';
    cancelButton.style.padding = '3px 130px'; // Adjust button size
    cancelButton.style.cursor = 'pointer';
    cancelButton.style.border = 'none';
    cancelButton.style.backgroundColor = '#ccc'; // Gray color for cancel
    cancelButton.style.color = '#fff';
    cancelButton.style.marginTop = '10px';

    cancelButton.addEventListener('click', function () {
        document.body.removeChild(overlay);
        if (typeof onCancel === 'function') {
            onCancel();
        }
    });

    header.appendChild(imgElement);
    header.appendChild(headerText);
    customAlert.appendChild(header);
    customAlert.appendChild(messageElement);
    customAlert.appendChild(confirmButton);
    customAlert.appendChild(cancelButton);
    overlay.appendChild(customAlert);
    document.body.appendChild(overlay);
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