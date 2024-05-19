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

// Retrieve station data and populate form fields
async function retrieveAndPopulateForm() {
    try {
        const docSnap = await getDoc(documentPath);
        if (docSnap.exists()) {
            // Retrieve the last stored height value from localStorage
            let heightRetrive = localStorage.getItem("imageHeightRetrive") || 700;

            // Access data for each document
            const stationData = docSnap.data();

            if (stationData.promotions != null) {
                // Iterate over each service in the array
                for (let i = 0; i < stationData.promotions.length; i++) {
                    const serviceName = stationData.promotions[i];
                    updateInputFields(serviceName, i); // Call your function to create input fields
                    heightRetrive = parseInt(heightRetrive) + 300;

                    // Store the updated height value in localStorage
                    localStorage.setItem("imageHeightRetrive", heightRetrive);
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

const form = document.getElementById("promotions");

form.addEventListener("submit", async function (event) {
    event.preventDefault();
    await updateStation();
    window.location.href = "homepagePM.html";
});

retrieveAndPopulateForm();

// update to station doc
async function updateStation() {

    // Update the station with more information
    try {
        await updateDoc(documentPath, {
            promotions: formPromotionArray,
        });
        console.log("Data successfully updated in Firestore.");
    } catch (error) {
        console.error("Error updating data in Firestore: ", error);
    }
}

// Get the container element
const promotionsContainer = document.getElementById('promotionsContainer');
let formPromotionArray = [];

// Function to update input fields based on services data
function updateInputFields(promotionName, index) {

    const stationServicesSpan = document.getElementById('promotionsText');
    if (stationServicesSpan) {
        stationServicesSpan.remove();
    }

    // Create a new container div for each pair
    const containerDiv = document.createElement('div');
    containerDiv.style = 'display: flex; flex-wrap: wrap;'; // Set display property to flex

    // Create a label element
    const labelElement = document.createElement('label');
    labelElement.textContent = 'Promotion ' + (index + 1) + ':';
    labelElement.style.display = 'block';
    labelElement.style.marginRight = '380px';
    labelElement.style.marginBottom = '5px';
    labelElement.style.marginTop = '23px';
    containerDiv.appendChild(labelElement);

    // Create a new button element
    const newButton = document.createElement('button');
    newButton.type = 'button';
    newButton.className = 'add-button';
    newButton.style = 'border: 2px solid #E74A3B; border-radius: 45%; background-color: white; height: 35px; width: 35px; margin-top: 20px;';

    // Create a new icon element
    const newIcon = document.createElement('i');
    newIcon.className = 'fas fa-trash-alt'; // Font Awesome delete icon
    // Add a style to set the color to red
    newIcon.style.color = '#E74A3B';

    // Append the icon to the button
    newButton.appendChild(newIcon);

    // Append the button to the container div
    containerDiv.appendChild(newButton);

    // Create a new input element
    const containerDivStartDate = document.createElement('div');
    containerDivStartDate.className = 'col-sm-6 mb-3 mb-sm-0';
    // Create a label for the start date
    const labelStartDate = document.createElement('label');
    labelStartDate.for = 'startDate';
    labelStartDate.textContent = 'Start Date';
    labelStartDate.style.fontSize = '16px';
    labelStartDate.style.display = 'gray';
    const inputStartDate = document.createElement('input');
    inputStartDate.className = 'form-control form-control-user';
    inputStartDate.type = 'Date';
    inputStartDate.id = 'startDate';
    inputStartDate.placeholder = 'Start Date';
    inputStartDate.value = promotionName.start;  // Set the value from the Firebase data
    inputStartDate.name = 'start_name';
    inputStartDate.required = true;
    inputStartDate.style.fontSize = '16px';
    inputStartDate.style.width = '230px';

    // Get the start date from Firebase
    const startDateFromFirebase = new Date(promotionName.start);
    const startDateFormatted = startDateFromFirebase.toISOString().split('T')[0];
    inputStartDate.min = startDateFormatted;

    containerDivStartDate.appendChild(labelStartDate);
    containerDivStartDate.appendChild(inputStartDate);
    containerDiv.appendChild(containerDivStartDate);



    // Create a new input element
    const containerDivEndDate = document.createElement('div');
    containerDivEndDate.className = 'col-sm-6';
    // Create a label for the start date
    const labelEndDate = document.createElement('label');
    labelEndDate.for = 'endDate';
    labelEndDate.textContent = 'End Date';
    labelEndDate.style.fontSize = '16px';
    labelEndDate.style.display = 'gray';
    labelEndDate.style.marginLeft = '3px';
    const inputEndDate = document.createElement('input');
    inputEndDate.className = 'form-control form-control-user';
    inputEndDate.type = 'Date';
    inputEndDate.id = 'endDate';
    inputEndDate.placeholder = 'End Date';
    inputEndDate.value = promotionName.end;  // Set the value from the Firebase data
    inputEndDate.name = 'end_name';
    inputEndDate.required = true;
    inputEndDate.style.fontSize = '16px';
    inputEndDate.style.width = '230px';

    // Set the minimum date to today
    inputEndDate.min = startDateFormatted;

    containerDivEndDate.appendChild(labelEndDate);
    containerDivEndDate.appendChild(inputEndDate);
    containerDiv.appendChild(containerDivEndDate);


    // Create a new input element
    const containerDivPromotion = document.createElement('div');
    containerDivPromotion.className = 'mb-3';
    // Create a label for the start date
    const labelPromotion = document.createElement('label');
    labelPromotion.for = 'promotion';
    labelPromotion.textContent = 'Promotion';
    labelPromotion.style.fontSize = '16px';
    labelPromotion.style.marginTop = '10px';
    labelPromotion.style.display = 'gray';
    const inputPromotion = document.createElement('input');
    inputPromotion.className = 'form-control form-control-user';
    inputPromotion.type = 'text';
    inputPromotion.id = 'promotion';
    inputPromotion.placeholder = 'Add your promotion';
    inputPromotion.value = promotionName.promotion;  // Set the value from the Firebase data
    inputPromotion.name = 'promotion';
    inputPromotion.required = true;
    inputPromotion.style.fontSize = '16px';
    inputPromotion.style.width = '487px';
    inputPromotion.style.height = '60px';

    containerDivPromotion.appendChild(labelPromotion);
    containerDivPromotion.appendChild(inputPromotion);
    containerDiv.appendChild(containerDivPromotion);


    // Store the initial value when the input field is created
    formPromotionArray[index] = promotionName;


    // Function to add a new promotion
    function addPromotion(start, end, promotion) {
        const promotionObject = {
            start: start,
            end: end,
            promotion: promotion
        };

        formPromotionArray[index] = promotionObject;
    }

    // Example of adding a new promotion
    let startDateValue = '';
    let endDateValue = '';
    let promotionValue = '';


    // Function to handle input changes and add promotion
    function handlePromotionInput(event) {
        const targetInput = event.target;
        const inputValue = targetInput.value.trim();

        // Determine which input field triggered the event
        switch (targetInput.id) {
            case 'startDate':
                // Get the trimmed value of the input field
                const updatedStartDate = inputStartDate.value.trim();

                // Update the array with the new value
                startDateValue = updatedStartDate;

                // Set the minimum date for end date based on start date
                inputEndDate.min = inputStartDate.value;

                // Call the addPromotion function with input values
                addPromotion(startDateValue, promotionName.end, promotionName.promotion);
                break;
            case 'endDate':
                // Get the trimmed value of the input field
                const updatedEndDate = inputEndDate.value.trim();

                // Update the array with the new value
                endDateValue = updatedEndDate;

                // Call the addPromotion function with input values
                addPromotion(promotionName.start, endDateValue, promotionName.promotion);
                break;
            case 'promotion':
                // Get the trimmed value of the input field
                const updatedPromotion = inputPromotion.value.trim();

                // Update the array with the new value
                promotionValue = updatedPromotion;

                // Call the addPromotion function with input values
                addPromotion(promotionName.start, promotionName.end, promotionValue);
                break;
        }

        // Check if all required values are present
        if (startDateValue && endDateValue && promotionValue) {
            // Call the addPromotion function with input values
            addPromotion(startDateValue, endDateValue, promotionValue);
        }
    }

    // Add event listener to a common parent element
    const formContainer = document.getElementById('promotionsContainer');
    formContainer.addEventListener('input', handlePromotionInput);

    // Function to remove event listeners from the promotion
    function removePromotionListeners() {
        formContainer.removeEventListener('input', handlePromotionInput);

    }

    // Add an event listener to the delete button
    newButton.addEventListener('click', async function () {
        showConfirm(
            'Are you sure you want to delete this promotion?',
            async function () {

                // Remove event listeners before deletion
                removePromotionListeners();

                formPromotionArray.splice(index, 1);

                // Remove the container div from the main container
                promotionsContainer.removeChild(containerDiv);


                await updateStation();

                console.log('User confirmed.');
            },
            function () {
                // Code to execute on cancel
                console.log('User canceled.');
            }
        );
    });

    // Append the container div to the main container
    promotionsContainer.appendChild(containerDiv);
}

let height = 800 || localStorage.getItem("imageHeightRetrive");


const PromotionsButton = document.getElementById("stationPromotionsButton");
PromotionsButton.addEventListener("click", async function (event) {
    addPromotionField();
    document.getElementById("BKimage").height = height;
    height = parseInt(height) + 400;

    // Store the updated height value in localStorage
    localStorage.setItem("imageHeight", height);
});
localStorage.removeItem("imageHeight");
localStorage.removeItem("imageHeightRetrive");

async function addPromotionField() {
    const stationServicesSpan = document.getElementById('promotionsText');
    if (stationServicesSpan) {
        stationServicesSpan.remove();
    }

    let index = formPromotionArray.length;


    // Dynamically created input field for station services
    const containerDivPromotions = document.createElement('div');
    containerDivPromotions.style = 'display: flex; flex-wrap: wrap;'; // Set display property to flex

    // Create a label element
    const labelElement = document.createElement('label');
    labelElement.textContent = 'Promotion ' + (index + 1) + ':';
    labelElement.style.display = 'block';
    labelElement.style.marginRight = '380px';
    labelElement.style.marginBottom = '5px';
    labelElement.style.marginTop = '23px';
    containerDivPromotions.appendChild(labelElement);

    // Create a new input element
    const containerDivStartDate = document.createElement('div');
    containerDivStartDate.className = 'col-sm-6 mb-3 mb-sm-0';
    // Create a label for the start date
    const labelStartDate = document.createElement('label');
    labelStartDate.for = 'startDate';
    labelStartDate.textContent = 'Start Date';
    labelStartDate.style.fontSize = '16px';
    labelStartDate.style.display = 'gray';
    const inputStartDate = document.createElement('input');
    inputStartDate.className = 'form-control form-control-user';
    inputStartDate.type = 'Date';
    inputStartDate.id = 'startDate';
    inputStartDate.placeholder = 'Start Date';
    inputStartDate.name = 'start_name';
    inputStartDate.required = true;
    inputStartDate.style.fontSize = '16px';
    inputStartDate.style.width = '230px';

    // Set the minimum date to today
    const today = new Date();
    const todayFormatted = today.toISOString().split('T')[0];
    inputStartDate.min = todayFormatted;

    containerDivStartDate.appendChild(labelStartDate);
    containerDivStartDate.appendChild(inputStartDate);
    containerDivPromotions.appendChild(containerDivStartDate);

    // Create a new input element
    const containerDivEndDate = document.createElement('div');
    containerDivEndDate.className = 'col-sm-6';
    // Create a label for the start date
    const labelEndDate = document.createElement('label');
    labelEndDate.for = 'endDate';
    labelEndDate.textContent = 'End Date';
    labelEndDate.style.fontSize = '16px';
    labelEndDate.style.display = 'gray';
    labelEndDate.style.marginLeft = '3px';
    const inputEndDate = document.createElement('input');
    inputEndDate.className = 'form-control form-control-user';
    inputEndDate.type = 'Date';
    inputEndDate.id = 'endDate';
    inputEndDate.placeholder = 'End Date';
    inputEndDate.name = 'end_name';
    inputEndDate.required = true;
    inputEndDate.style.fontSize = '16px';
    inputEndDate.style.width = '230px';

    // Set the minimum date to today
    inputEndDate.min = todayFormatted;

    containerDivEndDate.appendChild(labelEndDate);
    containerDivEndDate.appendChild(inputEndDate);
    containerDivPromotions.appendChild(containerDivEndDate);


    // Create a new input element
    const containerDivPromotion = document.createElement('div');
    containerDivPromotion.className = 'mb-3';
    // Create a label for the start date
    const labelPromotion = document.createElement('label');
    labelPromotion.for = 'promotion';
    labelPromotion.textContent = 'Promotion';
    labelPromotion.style.fontSize = '16px';
    labelPromotion.style.marginTop = '10px';
    labelPromotion.style.display = 'gray';
    const inputPromotion = document.createElement('input');
    inputPromotion.className = 'form-control form-control-user';
    inputPromotion.type = 'text';
    inputPromotion.id = 'promotion';
    inputPromotion.placeholder = 'Add your promotion';
    inputPromotion.name = 'promotion';
    inputPromotion.required = true;
    inputPromotion.style.fontSize = '16px';
    inputPromotion.style.width = '487px';
    inputPromotion.style.height = '60px';

    containerDivPromotion.appendChild(labelPromotion);
    containerDivPromotion.appendChild(inputPromotion);
    containerDivPromotions.appendChild(containerDivPromotion);


    // Store the initial value when the input field is created
    formPromotionArray[index] = '';


    // Function to add a new promotion
    function addPromotion(start, end, promotion) {
        const promotionObject = {
            start: start,
            end: end,
            promotion: promotion
        };

        formPromotionArray[index] = promotionObject;
    }

    // Example of adding a new promotion
    let startDateValue = '';
    let endDateValue = '';
    let promotionValue = '';


    // Function to handle input changes and add promotion
    function handlePromotionInput(event) {
        const targetInput = event.target;
        const inputValue = targetInput.value.trim();

        // Determine which input field triggered the event
        switch (targetInput.id) {
            case 'startDate':
                // Get the trimmed value of the input field
                const updatedStartDate = inputStartDate.value.trim();

                // Update the array with the new value
                startDateValue = updatedStartDate;

                // Set the minimum date for end date based on start date
                inputEndDate.min = inputStartDate.value;
                break;
            case 'endDate':
                // Get the trimmed value of the input field
                const updatedEndDate = inputEndDate.value.trim();

                // Update the array with the new value
                endDateValue = updatedEndDate;
                break;
            case 'promotion':
                // Get the trimmed value of the input field
                const updatedPromotion = inputPromotion.value.trim();

                // Update the array with the new value
                promotionValue = updatedPromotion;
                break;
        }

        // Check if all required values are present
        if (startDateValue && endDateValue && promotionValue) {
            // Call the addPromotion function with input values
            addPromotion(startDateValue, endDateValue, promotionValue);
        }
    }

    // Add event listener to a common parent element
    const formContainer = document.getElementById('promotionsContainer');
    formContainer.addEventListener('input', handlePromotionInput);




    // Append the container div to the main container
    promotionsContainer.appendChild(containerDivPromotions);
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