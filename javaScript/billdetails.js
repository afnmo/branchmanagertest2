// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getFirestore, doc, getDoc, deleteDoc } from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js';

// Firebase configuration for the web app
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
const billCollectionName = "Bills";


// Function to fetch and display bill details
async function fetchBillDetails() {
    try {
        // Retrieve query parameters from the URL
        const urlParams = new URLSearchParams(window.location.search);
        //--------------show the details:

        // Get values from query parameters
        const car_id = urlParams.get("car_id");
        const amount = urlParams.get("amount");
        const date = urlParams.get("date");
        const employeename = urlParams.get("employeename");
        const fuel_type = urlParams.get("fuel_type");
        const bill_Id = urlParams.get("billId");
 
        
        // Populate the table with bill details
        document.getElementById("employee").textContent = employeename;
        document.getElementById("fuel_type").textContent = fuel_type;
        document.getElementById("Date").textContent = date;
        document.getElementById("car").textContent = car_id;
        document.getElementById("cost").textContent = amount;

        //-------------------------------------delete icon:
        // Get the bill document from Firestore
        const billDocRef = doc(db, billCollectionName, bill_Id);
        const billDataSnapshot = await getDoc(billDocRef);
        if (billDataSnapshot.exists()) {
            const billData = billDataSnapshot.data();

            // Find the <h3> element containing the "Bill Details" title
            const billDetailsTitle = document.getElementById('billDetailsTitle');

            // Create the delete icon
            const deleteIcon = document.createElement("img");
            deleteIcon.src = "../images/delete.png";
            deleteIcon.alt = "Delete Icon";
            deleteIcon.width = 70;
            deleteIcon.height = 70;
            deleteIcon.style.cursor = "pointer";
            deleteIcon.style.marginLeft = "300px"; // Add some margin to separate it from the title

            // Append the delete icon next to the "Bill Details" title
            billDetailsTitle.appendChild(deleteIcon);

            deleteIcon.addEventListener('click', async function () {
                showConfirm(
                    'Are you sure you want to delete this bill?',
                    async function () {
                        // Create a reference to the bill document
                        const billDocRef = doc(db, `${billCollectionName}/${bill_Id}`);
                        // Delete the bill document from Firebase
                        await deleteDoc(billDocRef);
                        // Redirect to the bill page after deletion
                        window.location.href = "bill.html";
                        // Remove the custom alert overlay
                        const overlay = document.querySelector('#customAlertOverlay');
                        document.body.removeChild(overlay);
                        console.log('User confirmed.');
                    },
                    function () {
                        // Code to execute on cancel
                        console.log('User canceled.');
                    }
                );
            });

            // deleteIcon.addEventListener("click", async () => {
            //     showConfirm(`Are you sure you want to delete this bill?`);
            //     // Add event listener for the Yes, I'm Sure button in your custom alert
            //     const confirmButton = document.querySelector('#customAlertConfirmButton');
            //     const cancelButton = document.querySelector('#customAlertCancelButton');

            //     const confirmHandler = async () => {
            //         try {
            //             // Create a reference to the bill document
            //             const billDocRef = doc(db, `${billCollectionName}/${bill_Id}`);
            //             // Delete the bill document from Firebase
            //             await deleteDoc(billDocRef);
            //             // Redirect to the bill page after deletion
            //             window.location.href = "bill.html";
            //             // Remove the custom alert overlay
            //             const overlay = document.querySelector('#customAlertOverlay');
            //             document.body.removeChild(overlay);
            //         } catch (error) {
            //             console.error("Error deleting document: ", error);
            //         }
            //     };

            //     const cancelHandler = () => {
            //         // Remove the custom alert overlay
            //         const overlay = document.querySelector('#customAlertOverlay');
            //         document.body.removeChild(overlay);
            //     };

            //     confirmButton.addEventListener('click', confirmHandler);
            //     cancelButton.addEventListener('click', cancelHandler);
            // });

            // Find the <h3> element containing the "Bill Details" title
            const billDetailsTitle2 = document.getElementById('billDetailsTitle2');

            // Create the edit icon
            const editIcon = document.createElement("img");
            editIcon.src = "../images/editIcon.png"; // Replace with the correct path
            editIcon.alt = "Edit Icon";
            editIcon.width = 40; // Adjust the width and height accordingly
            editIcon.height = 40;

            editIcon.style.cursor = "pointer";
            // Append the edit icon next to the "Bill Details" title
            billDetailsTitle.appendChild(editIcon);

            editIcon.addEventListener("click", () => {
                const car_id = billData.carId;
                const amount = billData.amount;
                const date = billData.date;
                const employeename = billData.employeeName;
                const fuel_type = billData.fuelType;
                const day = billData.day;
                const month = billData.month;
                const year = billData.year;

                // Use the previously defined bill_Id variable
                console.log("ID:", bill_Id);

                // Construct the URL with query parameters for the update page
                const url = `billUpdate.html?car_id=${car_id}&amount=${amount}&day=${day}&month=${month}&year=${year}&employeename=${employeename}&fuel_type=${fuel_type}&billId=${bill_Id}`;

                // Redirect to the bill update page with query parameters
                window.location.href = url;
            });

            // Append the edit icon inside the card-body div
            cardBody.appendChild(editIcon);
        } else {
            console.error("Bill document does not exist");
        }
    } catch (error) {
        console.error("Error fetching bill details:", error);
    }
}

// Call the function to fetch and display bill details
fetchBillDetails();

//alert for critical massage:
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