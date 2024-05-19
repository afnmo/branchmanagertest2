// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getFirestore, doc, getDoc, collection, query, where, getDocs, deleteDoc } from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js';

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

// Specify the collection name for bills
const billCollectionName = "Bills";

// Retrieve branch manager ID from session storage
const BMID = sessionStorage.getItem('sessionID');

// Wait for the DOM content to be fully loaded
document.addEventListener("DOMContentLoaded", async () => {
    // Call the fetchBillList function with the necessary parameters
    await fetchBillList(db, billCollectionName, BMID);
});

// Function to fetch and display the list of bills
async function fetchBillList(db, billCollectionName, BMID) {
    try {
        // Create a reference to the bill collection
        const billCollectionRef = collection(db, billCollectionName);

        // Query the bills with the specific branch manager ID
        const billQuery = query(billCollectionRef, where("branch_manager_id", "==", BMID));
        const billQuerySnapshot = await getDocs(billQuery);

        // Clear existing bill list
        const billList = document.getElementById("BillList");
        billList.innerHTML = '';

        if (billQuerySnapshot.empty) {
            // Display a message if the bill list is empty
            const emptyListItem = document.createElement("p");
            emptyListItem.textContent = "You don't have any bills yet";
            emptyListItem.style.marginRight = "50px"; // Add margin to the top
            emptyListItem.style.marginLeft = "50px"; // Add margin to the top
            emptyListItem.style.marginTop = "100px";
            billList.appendChild(emptyListItem);
        } else {
            // Populate the bill list
            billQuerySnapshot.forEach((billDoc) => {
                const billData = billDoc.data();

                // Create a list item for each bill
                const listItem = document.createElement("li");

                // Create a container for the bill name and icon
                const containerDiv = document.createElement("div");
                containerDiv.style.display = "flex";
                containerDiv.style.justifyContent = "space-between"; // Align items to the right

                // Create a span for the bill name
                const billNameSpan = document.createElement("span");
                billNameSpan.textContent = `#${billDoc.id}`;

                // Create a horizontal line
                const horizontalLine = document.createElement("hr");

                // Create an icon for zooming
                const zoomIcon = document.createElement("img");
                zoomIcon.src = "../images/zoom.svg";
                zoomIcon.style.width = "23px"; // Adjust icon size if needed
                zoomIcon.style.cursor = "pointer"; // Change cursor to pointer on hover

                // Add event listener to handle clicks on the icon
                zoomIcon.addEventListener("click", () => {
                    // Get the bill data
                    const car_id = billData.carId;
                    const amount = billData.amount;
                    const date = billData.date;
                    const employeename = billData.employeeName;
                    const fuel_type = billData.fuelType;
                    const bill_Id = billDoc.id;

                    // Construct the URL with query parameters
                    const url = `billdetails.html?car_id=${car_id}&amount=${amount}&date=${date}&employeename=${employeename}&fuel_type=${fuel_type}&billId=${bill_Id}`;

                    // Redirect to the bill details page with query parameters
                    window.location.href = url;
                });

                // Append the bill name and icon to the container
                containerDiv.appendChild(billNameSpan);
                containerDiv.appendChild(zoomIcon);

                // Append the container and horizontal line to the list item
                listItem.appendChild(containerDiv);
                listItem.appendChild(horizontalLine);

                // Append the list item to the bill list
                billList.appendChild(listItem);
            });
        }
    } catch (error) {
        console.error("Error accessing Firestore for bills:", error);
    }
}