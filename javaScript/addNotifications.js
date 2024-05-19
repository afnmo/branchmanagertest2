// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getFirestore, collection, doc, setDoc, updateDoc, deleteDoc, getDoc } from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js';

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

// Function to delete promotions with end date smaller than start date from Firebase
async function notification() {

    try {
        const docSnap = await getDoc(documentPath);
        if (docSnap.exists()) {
            const stationData = docSnap.data();

            // Ensure notifications field exists and is an array
            const notifications = stationData.notifications || [];

            // Array to store promotions ending two days from the current date
            const upcomingPromotions = [];

            for (const promotion of stationData.promotions) {
                const endDate = new Date(promotion.end);
                const twoDaysBefore = new Date();
                twoDaysBefore.setDate(twoDaysBefore.getDate() + 2);

                if (endDate.getDate() === twoDaysBefore.getDate()) {
                    // Check if promotion is not already in notifications array
                    const promotionExists = notifications.some(existingPromotion =>
                        existingPromotion.promotion === promotion.promotion &&
                        existingPromotion.end === promotion.end);

                    if (!promotionExists) {
                        upcomingPromotions.push(promotion);
                    }
                }
            }

            // Check if there are any upcoming promotions
            if (upcomingPromotions.length > 0) {
                const bellIcon = document.querySelector('.notification-icon');
                bellIcon.classList.add('new-notifications'); // Add the class to indicate new notifications

                // Dynamically add the CSS rule
                const styleElement = document.createElement('style');
                styleElement.textContent = `
        .new-notifications:after {
            content: '';
            position: absolute;
            top: -1px;
            right: -1px;
            width: 9px;
            height: 9px;
            background-color:rgb(248, 165, 26);
            border-radius: 50%;
        }
    `;
                document.head.appendChild(styleElement);



            }

        }
    } catch (error) {
        console.error('Error reading: ', error);
    }
}


notification();
