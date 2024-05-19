// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getFirestore, collection, doc, getDocs, updateDoc, deleteDoc, getDoc } from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js';

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

// Create a reference to the collection
const collectionRef = collection(db, collectionName);

// Function to delete promotions with end date smaller than start date from Firebase
async function deleteEndedPromotion() {
    try {
        const snapshot = await getDocs(collectionRef)

        snapshot.forEach(async (stationDoc) => {
            const promotions = stationDoc.data().promotions;

            // Filter promotions to keep only those with end date greater than today
            const validPromotions = promotions.filter(promotion => {
                const endDate = new Date(promotion.end);
                const today = new Date();
                return endDate >= today;
            });

            // Update the document with the filtered promotions
            await updateDoc(stationDoc.ref, { promotions: validPromotions });
            
        });

        snapshot.forEach(async (stationDoc) => {
            const notifications = stationDoc.data().notifications;

            // Filter promotions to keep only those with end date greater than today
            const validNotifications = notifications.filter(notification => {
                const endDate = new Date(notification.end);
                const today = new Date();
                return endDate >= today;
            });

            // Update the document with the filtered promotions
            await updateDoc(stationDoc.ref, { notifications: validNotifications });
            
        });

        console.log('Promotions deleted successfully.');
    } catch (error) {
        console.error('Error deleting promotions:', error);
    }
}


// Call the function to delete promotions
deleteEndedPromotion();