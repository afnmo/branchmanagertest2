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

// Call the function to populate the form when the page loads
document.addEventListener("DOMContentLoaded", retrieveAndPopulateForm);

// Retrieve station data and populate form fields
async function retrieveAndPopulateForm() {
    try {
        const docSnap = await getDoc(documentPath);
        if (docSnap.exists()) {
            // Access data for each document
            const stationData = docSnap.data();

            document.getElementById("StationName").value = stationData.name;
            document.getElementById("StationLocation").value = stationData.location;
            document.getElementById("StationName").style.fontSize = "larger";
            document.getElementById("StationLocation").style.fontSize = "larger";
            document.getElementById("StationName").style.color = "#f8a71a98";
            document.getElementById("StationLocation").style.color = "#f8a71a98";

            if (stationData.open_hour != null)
                document.getElementById("OpenHour").value = stationData.open_hour;

            if (stationData.close_hour != null)
                document.getElementById("CloseHour").value = stationData.close_hour;

            if (stationData.image_station != null)
                document.getElementById('imageUpload').value = stationData.image_station;

            if (stationData.maximum != null)
                document.getElementById('occupancyLevel').value = stationData.maximum;

            // Checkboxes and radio buttons can be populated here
            populateCheckBoxesAndRadioButtons(stationData);


            if (stationData.services != null) {
                // Retrieve the last stored height value from localStorage
                let heightRetrive = localStorage.getItem("imageHeightRetrive") || 1000;

                const requiredServices = ["Convenience Store", "ATM", "Car Wash", "Car Mechanic", "Mosque", "Restrooms"];

                let oneService = false;

                // Iterate over each service in the array
                for (let i = 0; i < stationData.services.length; i++) {
                    const serviceName = stationData.services[i];

                    if (requiredServices.includes(serviceName)) {
                        const checkbox = document.getElementById(`service${serviceName}`);
                        if (checkbox) {
                            checkbox.checked = true;
                        }
                    } else {
                        retriveServices(serviceName, i); // Call your function to create input fields
                        const checkbox = document.getElementById(`other`);
                        if (checkbox) {
                            checkbox.checked = true;
                            document.getElementById("ownServices").style.display = 'block';
                        }
                        oneService = true;
                    }
                    heightRetrive = parseInt(heightRetrive) + 200;
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

// Function to populate checkboxes and radio buttons
function populateCheckBoxesAndRadioButtons(stationData) {
    const fuelTypes = stationData.fuel_type || [];
    const fuelStatus = stationData.fuel_status || [];

    // Loop through checkbox elements and set their checked status based on the data
    fuelTypes.forEach((fuelType) => {
        const checkbox = document.getElementById(`fuelType${fuelType}`);
        if (checkbox) {
            checkbox.checked = true;
            const radioGroup = document.getElementById(`${fuelType}State`);
            if (radioGroup) {
                radioGroup.style.display = 'block';
            }
        }
    });

    // Loop through radio button elements and set their checked status based on the data
    fuelStatus.forEach((status) => {
        const [type, state] = status.split(" ");
        const radioButton = document.getElementById(`${type}${state}`);
        if (radioButton) {
            radioButton.checked = true;
        }
    });

    // Handle the heightBox and BKimage based on the number of checkboxes
    const numCheckbox = fuelTypes.length;
    if (numCheckbox === 1) {
        document.getElementById("heightBox").style.height = 1400;
        document.getElementById("BKimage").height = 1400;
    } else if (numCheckbox === 2) {
        document.getElementById("heightBox").style.height = 1400;
        document.getElementById("BKimage").height = 1400;
    } else if (numCheckbox === 3) {
        document.getElementById("heightBox").style.height = 1500;
        document.getElementById("BKimage").height = 1500;
    }
}


// Get references to the checkboxes and radio button groups
const checkbox1 = document.getElementById('fuelType91');
const checkbox2 = document.getElementById('fuelType95');
const checkbox3 = document.getElementById('fuelTypeDiesel');
const radioGroup1 = document.getElementById('91State');
const radioGroup2 = document.getElementById('95State');
const radioGroup3 = document.getElementById('DieselState');

// Add event listeners to the checkboxes
checkbox1.addEventListener('change', toggleRadioGroup);
checkbox2.addEventListener('change', toggleRadioGroup);
checkbox3.addEventListener('change', toggleRadioGroup);

function toggleRadioGroup() {
    // Show/hide the radio button group for 91 based on its checkbox state
    if (checkbox1.checked) {
        radioGroup1.style.display = 'block';
        document.getElementById("heightBox").style.height = 1400;
        document.getElementById("BKimage").height = 1400;
    } else {
        radioGroup1.style.display = 'none';
    }

    // Show/hide the radio button group for 95 based on its checkbox state
    if (checkbox2.checked) {
        radioGroup2.style.display = 'block';
        document.getElementById("heightBox").style.height = 1400;
        document.getElementById("BKimage").height = 1400;
    } else {
        radioGroup2.style.display = 'none';
    }

    // Show/hide the radio button group for Diesel based on its checkbox state
    if (checkbox3.checked) {
        radioGroup3.style.display = 'block';
        document.getElementById("heightBox").style.height = 1500;
        document.getElementById("BKimage").height = 1500;
    } else {
        radioGroup3.style.display = 'none';
    }
}

const form = document.getElementById("editStation");

form.addEventListener("submit", async function (event) {
    // Prevent the form from submitting in the traditional way
    event.preventDefault();

    const fuelTypes = ["91", "95", "Diesel"];
    let hasChecked = false; // Flag to track if at least one checkbox is checked for each fuel type

    for (const fuelType of fuelTypes) {
        const checkboxes = document.querySelectorAll(`input[name="fuelType"][value="${fuelType}"]`);
        const radioButtons = document.querySelectorAll(`input[name^="fuelState${fuelType}"]`);

        const checkedCheckboxes = Array.from(checkboxes).filter(checkbox => checkbox.checked);

        if (checkedCheckboxes.length > 0) {
            const checkedRadioButtons = Array.from(radioButtons).filter(radio => radio.checked);
            if (checkedRadioButtons.length === 0) {
                showAlert(`Please select the status for Fuel Type ${fuelType}`);
                return; // Prevent form submission if a validation check fails
            }

            hasChecked = true;
        }
    }

    const serviceChecked = document.getElementsByName("service");

    for (let i = 0; i < serviceChecked.length; i++) {
        if (serviceChecked[i].checked) {
            formServiceArray.push(serviceChecked[i].value);
        }
    }
    
    // Check if at least one checkbox is checked or if at least one service is added in the input field
    const checkboxesChecked = document.querySelectorAll('input[name="service"]:checked');
    const inputFields = document.querySelectorAll('input[name="stationServies"]');

    if (checkboxesChecked.length === 0 && inputFields.length === 0) {
        showAlert("Please add at least one service");
        return; // Prevent form submission if formServiceArray is empty
    }

    // If all validation checks pass, you can proceed to update the Firestore document
    if (hasChecked) {
        await AddStation();

        window.location.href = "homepagePM.html";
    } else {
        showAlert("Please select at least one checkbox for each fuel type");
    }

});

retrieveAndPopulateForm();

// set to station doc
async function AddStation() {
    const stationImage = document.getElementById("imageUpload").value;
    const OpenHour = document.getElementById("OpenHour").value;
    const CloseHour = document.getElementById("CloseHour").value;
    const occupancyLevel = document.getElementById("occupancyLevel").value;
    const occupancyLevelValue = parseInt(occupancyLevel, 10);
    const fuelType = document.getElementsByName("fuelType");
    let fuelTypeArray = [];
    let fuelStatevalue = [];

    for (let i = 0; i < fuelType.length; i++) {
        if (fuelType[i].checked) {
            fuelTypeArray.push(fuelType[i].value);

            // Check if the corresponding radio button is checked
            // Use the name attribute to identify the related radio buttons
            const relatedRadioName = "fuelState" + fuelType[i].value;
            const relatedRadioButtons = document.getElementsByName(relatedRadioName);

            for (let j = 0; j < relatedRadioButtons.length; j++) {
                if (relatedRadioButtons[j].checked) {
                    fuelStatevalue.push(relatedRadioButtons[j].value);
                    break; // Stop checking once you find the checked radio button
                }
            }
        }
    }

    // Define a reference to the Firestore collection id change based on PM fk *******************
    const myCollection = doc(db, "Station", stationID);

    // Update the station with more information
    try {
        await updateDoc(myCollection, {
            open_hour: OpenHour,
            close_hour: CloseHour,
            image_station: stationImage,
            fuel_type: fuelTypeArray,
            fuel_status: fuelStatevalue,
            maximum: occupancyLevelValue,
            services: formServiceArray,
        });
        console.log("Data successfully updated in Firestore.");
    } catch (error) {
        console.error("Error updating data in Firestore: ", error);
    }
}

let height = 1600 || localStorage.getItem("imageHeightRetrive");

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

const formServiceArray = [];

// Get the container element
const servicesContainer = document.getElementById('servicesContainer');

// Function to create input fields based on services data
function retriveServices(serviceName, index) {
    // Create a new container div for each pair
    const containerDiv = document.createElement('div');
    containerDiv.style = 'display: flex; align-items: center;'; // Set display property to flex

    // Create a new input element
    const newInput = document.createElement('input');
    newInput.className = 'form-control form-control-user';
    newInput.type = 'text';
    newInput.style = 'color: #4F4F4F; font-weight: 500; margin: 5px; font-size: 18px; width: 495px;';
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
        showConfirm(
            'Are you sure you want to delete this service?',
            async function () {

                // Remove the input event listener
                newInput.removeEventListener('input', handleServiceInput);

                // Remove the corresponding entry from the array
                formServiceArray.splice(index, 1);

                // Remove the container div from the main container
                servicesContainer.removeChild(containerDiv);

                await AddStation();
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
    newInput.style = 'color: #4F4F4F; font-weight: 500; margin: 5px; font-size: 18px; width: 495px;';
    newInput.name = 'stationServies';
    newInput.placeholder = 'Add your station services';
    newInput.required = true;


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