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
            
            // Checkboxes and radio buttons can be populated here
            populateCheckBoxesAndRadioButtons(stationData);

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
        document.getElementById("heightBox").style.height = 500;
        document.getElementById("BKimage").height = 550;
    } else if (numCheckbox === 2) {
        document.getElementById("heightBox").style.height = 500;
        document.getElementById("BKimage").height = 550;
    } else if (numCheckbox === 3) {
        document.getElementById("heightBox").style.height = 500;
        document.getElementById("BKimage").height = 550;
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
        document.getElementById("heightBox").style.height= 300;
        document.getElementById("BKimage").height= 300;
    } else {
        radioGroup1.style.display = 'none';
    }

    // Show/hide the radio button group for 95 based on its checkbox state
    if (checkbox2.checked) {
        radioGroup2.style.display = 'block';
        document.getElementById("heightBox").style.height= 300;
        document.getElementById("BKimage").height= 300;
    } else {
        radioGroup2.style.display = 'none';
    }

    // Show/hide the radio button group for Diesel based on its checkbox state
    if (checkbox3.checked) {
        radioGroup3.style.display = 'block';
        document.getElementById("heightBox").style.height= 300;
        document.getElementById("BKimage").height= 300;
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
            fuel_type: fuelTypeArray,
            fuel_status: fuelStatevalue,
        });
        console.log("Data successfully updated in Firestore.");
    } catch (error) {
        console.error("Error updating data in Firestore: ", error);
    }
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