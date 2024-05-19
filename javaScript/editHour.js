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
            // Access data for each document
            const stationData = docSnap.data();

            if (stationData.open_hour != null)
                document.getElementById("OpenHour").value = stationData.open_hour;

            if (stationData.close_hour != null)
                document.getElementById("CloseHour").value = stationData.close_hour;

            if (stationData.image_station != null)
                document.getElementById('imageUpload').value = stationData.image_station;

        } else {
            console.log("Document does not exist.");
        }
    } catch (error) {
        console.error("Error reading document: ", error);
    }
}

const form = document.getElementById("editStation");

form.addEventListener("submit", async function (event) {
    event.preventDefault();
    await updateStation();
    window.location.href = "homepagePM.html";
});

retrieveAndPopulateForm();

// update to station doc
async function updateStation() {
    const OpenHour = document.getElementById("OpenHour").value;
    const CloseHour = document.getElementById("CloseHour").value;

    // Update the station with more information
    try {
        await updateDoc(documentPath, {
            open_hour: OpenHour,
            close_hour: CloseHour,
        });
        console.log("Data successfully updated in Firestore.");
    } catch (error) {
        console.error("Error updating data in Firestore: ", error);
    }
}

