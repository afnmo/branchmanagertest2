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
    let displayNotifications = true;
    let displayUpcomingPromotions = true;

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

            const promotionsList = document.getElementById('promotions');
            let heightBK = 500;

            // Check if there are any upcoming promotions
            if (upcomingPromotions.length > 0) {

                const branchManagerId = stationData.branch_manager_id;
                if (branchManagerId) {
                    const branchManagerDocRef = doc(db, 'Branch_Manager', branchManagerId);
                    const branchManagerDoc = await getDoc(branchManagerDocRef);

                    if (branchManagerDoc.exists()) {
                        const reminder = 'Upcoming Promotion Ending Soon';
                        const managerFirstName = branchManagerDoc.data().firstName;
                        const managerLastName = branchManagerDoc.data().lastName;


                        upcomingPromotions.forEach((upcomingPromotion, index) => {
                            const listItem = document.createElement('li');
                            listItem.classList.add('text-uppercase', 'fw-semibold', 'text-dark', 'mb-4');
                            listItem.style.fontFamily = 'Roboto, sans-serif';
                            listItem.style.fontWeight = 'bold';
                            listItem.style.textAlign = 'center';
                            listItem.style.backgroundColor = '#ffffff';
                            listItem.style.borderRadius = '15px';
                            listItem.style.padding = '20px';
                            listItem.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.1)';
                            listItem.style.width = '100%';
                            listItem.style.margin = 'auto';

                            const title = document.createElement('h3');
                            title.id = 'notificationTitle';
                            title.style.marginBottom = '10px';
                            title.style.paddingBottom = '5px';
                            title.style.color = 'rgb(48, 180, 118)';
                            title.style.textTransform = 'none';

                            // Creating the 'subject' variable with 'Warning' in red color
                            const subject = document.createElement('span');
                            subject.style.color = 'red';
                            subject.textContent = 'Warning';
                            title.innerHTML = `<br><img src="../images/warning.png"><br><br>${subject.outerHTML}<br><br>${reminder}`;


                            const paragraph = document.createElement('h4');
                            paragraph.id = 'notificationContent';
                            paragraph.style.borderLeft = '4px solid #28a745';
                            paragraph.style.paddingLeft = '10px';
                            paragraph.style.color = '#575656';
                            paragraph.style.textTransform = 'none';
                            const endDate = new Date(upcomingPromotion.end).toDateString();
                            const content = `This is a reminder that the promotion "${upcomingPromotion.promotion}" is <span style="color: red;">ending in two days</span> on ${endDate}.<br><br>`;
                            paragraph.innerHTML = `Dear ${managerFirstName} ${managerLastName},<br><br>
                            ${content}
                            Please take necessary actions.<br><br>
                            <a href="promotions.html" style="text-decoration: underline; color: #28a745; font-weight: bold; font-size: 16px;">
                            Click here to view promotions</a><br><br>
                            Sincerely,<br><br>
                            91 website <img src="../images/Logo.png" width="30" height="30"> `;

                            const newLine = document.createElement('br');
                            promotionsList.appendChild(newLine);

                            listItem.appendChild(title);
                            listItem.appendChild(paragraph);
                            promotionsList.appendChild(listItem);

                            const newLine1 = document.createElement('br');
                            promotionsList.appendChild(newLine1);

                            displayUpcomingPromotions = false;

                            heightBK = heightBK + 700;
                            document.getElementById("BKimage").height = heightBK;
                        });
                    }
                }
            }

            // Check if there are any upcoming notifications
            if (notifications.length > 0) {
                const branchManagerId = stationData.branch_manager_id;
                if (branchManagerId) {
                    const branchManagerDocRef = doc(db, 'Branch_Manager', branchManagerId);
                    const branchManagerDoc = await getDoc(branchManagerDocRef);

                    if (branchManagerDoc.exists()) {
                        const reminder = 'Upcoming Promotion Ending Soon';
                        const managerFirstName = branchManagerDoc.data().firstName;
                        const managerLastName = branchManagerDoc.data().lastName;

                        let heightBK1 = heightBK;

                        notifications.forEach((upcomingPromotion, index) => {
                            const listItem = document.createElement('li');
                            listItem.classList.add('text-uppercase', 'fw-semibold', 'text-dark', 'mb-4');
                            listItem.style.fontFamily = 'Roboto, sans-serif';
                            listItem.style.fontWeight = 'bold';
                            listItem.style.textAlign = 'center';
                            listItem.style.backgroundColor = '#ffffff';
                            listItem.style.borderRadius = '15px';
                            listItem.style.padding = '20px';
                            listItem.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.1)';
                            listItem.style.width = '100%';
                            listItem.style.margin = 'auto';

                            const title = document.createElement('h3');
                            title.id = 'notificationTitle';
                            title.style.marginBottom = '10px';
                            title.style.paddingBottom = '5px';
                            title.style.color = 'rgb(48, 180, 118)';
                            title.style.textTransform = 'none';

                            // Creating the 'subject' variable with 'Warning' in red color
                            const subject = document.createElement('span');
                            subject.style.color = 'red';
                            subject.textContent = 'Warning';
                            title.innerHTML = `<br><img src="../images/warning.png"><br><br>${subject.outerHTML}<br><br>${reminder}`;


                            const paragraph = document.createElement('h4');
                            paragraph.id = 'notificationContent';
                            paragraph.style.borderLeft = '4px solid #28a745';
                            paragraph.style.paddingLeft = '10px';
                            paragraph.style.color = '#575656';
                            paragraph.style.textTransform = 'none';
                            const endDate = new Date(upcomingPromotion.end).toDateString();
                            const content = `This is a reminder that the promotion "${upcomingPromotion.promotion}" is <span style="color: red;">ending in two days</span> on ${endDate}.<br><br>`;
                            paragraph.innerHTML = `Dear ${managerFirstName} ${managerLastName},<br><br>
                ${content}
                Please take necessary actions.<br><br>
                <a href="promotions.html" style="text-decoration: underline; color: #28a745; font-weight: bold; font-size: 16px;">
                Click here to view promotions</a><br><br>
                Sincerely,<br><br>
                91 website <img src="../images/Logo.png" width="30" height="30"> `;

                            const newLine = document.createElement('br');
                            promotionsList.appendChild(newLine);

                            listItem.appendChild(title);
                            listItem.appendChild(paragraph);
                            promotionsList.appendChild(listItem);

                            const newLine1 = document.createElement('br');
                            promotionsList.appendChild(newLine1);


                            displayNotifications = false;

                            heightBK1 = heightBK1 + 700;
                            document.getElementById("BKimage").height = heightBK1;
                        });
                    }
                }

            }

            if (displayNotifications && displayUpcomingPromotions) {
                const listItem = document.createElement('li');
                listItem.classList.add('text-uppercase', 'fw-semibold', 'text-dark', 'mb-4');
                listItem.style.fontFamily = 'Roboto, sans-serif';
                listItem.style.fontWeight = 'bold';
                listItem.style.textAlign = 'center';
                listItem.style.backgroundColor = '#ffffff';
                listItem.style.borderRadius = '15px';
                listItem.style.padding = '20px';
                listItem.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.1)';
                listItem.style.width = '100%';
                listItem.style.margin = 'auto';

                const title = document.createElement('h3');
                title.id = 'notificationTitle';
                title.style.marginBottom = '10px';
                title.style.paddingBottom = '5px';
                title.style.color = 'rgb(48, 180, 118)';
                title.style.textTransform = 'none';
                title.innerHTML = '<br><img src="../images/noNotification.png"><br><br> No Available Notifications <br>';

                const paragraph = document.createElement('h4');
                paragraph.id = 'notificationContent';
                paragraph.style.borderLeft = '4px solid #28a745';
                paragraph.style.paddingLeft = '10px';
                paragraph.style.color = '#575656';
                paragraph.style.textTransform = 'none';
                paragraph.innerHTML = `<br> Check back later for updates! <br><br>
                Sincerely,<br><br>
                91 website <img src="../images/Logo.png" width="30" height="30">`;

                listItem.appendChild(title);
                listItem.appendChild(paragraph);
                promotionsList.appendChild(listItem);
            }


            updateStation(upcomingPromotions);

        } else {
            console.log('Document does not exist.');
        }
    } catch (error) {
        console.error('Error reading or updating document: ', error);
    }
}


notification();

// update to station doc
async function updateStation(upcomingPromotions) {
    try {
        const docSnap = await getDoc(documentPath);
        if (docSnap.exists()) {
            const stationData = docSnap.data();

            // Check if notifications field exists
            if (!stationData.notifications) {
                // If notifications field doesn't exist, add it
                await setDoc(documentPath, { notifications: upcomingPromotions }, { merge: true });
            } else {
                // If notifications field exists, update its value
                const mergedPromotions = [...stationData.notifications, ...upcomingPromotions];
                await updateDoc(documentPath, { notifications: mergedPromotions });
            }
        } else {
            console.log('Station document does not exist.');
        }
    } catch (error) {
        console.error("Error updating station document in Firestore: ", error);
    }
}