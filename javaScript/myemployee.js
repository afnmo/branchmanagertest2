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

// Specify the collection name for employees
const employeeCollectionName = "Station_Employee";

// Retrieve branch manager ID from session storage
const BMID = sessionStorage.getItem('sessionID');

// Wait for the DOM content to be fully loaded
document.addEventListener("DOMContentLoaded", async () => {
    // Call the fetchEmployeeList function with the necessary parameters
    await fetchEmployeeList(db, employeeCollectionName, BMID);
});

// Function to fetch and display the list of employees
async function fetchEmployeeList(db, employeeCollectionName, BMID) {
    try {
        // Create a reference to the employee collection
        const employeeCollectionRef = collection(db, employeeCollectionName);

        // Query the employees with the specific branch manager ID
        const employeeQuery = query(employeeCollectionRef, where("branch_manager_id", "==", BMID));
        const employeeQuerySnapshot = await getDocs(employeeQuery);

        // Clear existing employee list
        const employeeList = document.getElementById("EmployeeList");
        employeeList.innerHTML = '';

        if (employeeQuerySnapshot.empty) {
            // Display a message if the employee list is empty
            const emptyListItem = document.createElement("p");
            emptyListItem.textContent = "You don't have any employees yet";
            emptyListItem.style.marginRight = "50px"; // Add margin to the top
            emptyListItem.style.marginLeft = "50px"; // Add margin to the top
            emptyListItem.style.marginTop = "100px";
            employeeList.appendChild(emptyListItem);
        } else {
            // Populate the employee list
            employeeQuerySnapshot.forEach((employeeDoc) => {
                const employeeData = employeeDoc.data();

                // Check if the employee is not terminated
                
                    const listItem = document.createElement("li");

                    // Create a container for the employee name
                    const containerDiv = document.createElement("div");
                    containerDiv.style.display = "flex";
                    containerDiv.style.justifyContent = "space-between"; // Align items to the right

                    // Create a span for the employee name
                    const employeeNameSpan = document.createElement("span");
                    employeeNameSpan.textContent = `${employeeData.firstName} ${employeeData.lastName}`;

                    // Create a horizontal line
                    const horizontalLine = document.createElement("hr");

                    // Create a div to wrap the icons and control their spacing
                    const iconsWrapper = document.createElement("div");
                    iconsWrapper.style.display = "flex";
                    iconsWrapper.style.alignItems = "center";

                    // Append the employee name to the container
                    containerDiv.appendChild(employeeNameSpan);

                    // Append the container and horizontal line to the list item
                    listItem.appendChild(containerDiv);
                    listItem.appendChild(horizontalLine);

                    // Append the list item to the employee list
                    employeeList.appendChild(listItem);
                
            });
        }
    } catch (error) {
        console.error("Error accessing Firestore for employees:", error);
    }
}
