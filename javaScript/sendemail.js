function sendOTP() {
  const email = document.getElementById('email');
  const otpverify = document.getElementsByClassName('otpverify')[0];

  // Check if an OTP has already been sent to this email
  const hasOTPSent = sessionStorage.getItem(email.value);

  if (hasOTPSent) {
    showAlert("OTP has already been sent to this email.");
      return; // Exit the function
  }

  let otp_val = Math.floor(Math.random() * 10000);

  let emailbody = `
      <h1>Please Subscribe to 91 </h1> <br>
      <h2>Your OTP is </h2>${otp_val}
  `;

  Email.send({
      SecureToken: "57e69e22-01b8-44cf-9b23-f0672c96a21a",
      To: email.value,
      From: "Shaaahd1441@gmail.com",
      Subject: "This is from 91, Please Subscribe",
      Body: emailbody
  }).then(message => {
      if (message === "OK") {
          // Mark this email as having received an OTP
          sessionStorage.setItem(email.value, "sent");

          showAlert("OTP sent to your email " + email.value);
          otpverify.style.display = "block";
          const otp_inp = document.getElementById('otp_inp');
          const otp_btn = document.getElementById('otp_btn');

          otp_btn.addEventListener('click', () => {
              if (otp_inp.value == otp_val) {
                showAlert("Email address verified...");
              } else {
                showAlert("Invalid OTP");
              }
          });
      }
  });
}



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


// //OTP code

// function sendOTP() {
//     const email = document.getElementById('email');
//     const otpverify = document.getElementsByClassName('otpverify')[0];
//     let otp_val = Math.floor(Math.random() * 10000);

//     let emailbody = `
//         <h1>Please Subscribe to 91 </h1> <br>
//         <h2>Your OTP is </h2>${otp_val}
//     `;



//     Email.send({
//         SecureToken: "57e69e22-01b8-44cf-9b23-f0672c96a21a",
//         To: email.value,
//         From: "Shaaahd1441@gmail.com",
//         Subject: "This is the from 91, Please Subscribe",
//         Body: emailbody
//     }).then(
//         //if success it returns "OK";
//         message => {
//             if (message === "OK") {
//                 alert("OTP sent to your email " + email.value);
//                 // now making otp input visible
//                 otpverify.style.display = "block";
//                 const otp_inp = document.getElementById('otp_inp');
//                 const otp_btn = document.getElementById('otp_btn');

//                 otp_btn.addEventListener('click', () => {
//                     // now check whether sent email is valid
//                     if (otp_inp.value == otp_val) {
//                         alert("Email address verified...");
                      
//                     }
//                     else {
//                         alert("Invalid OTP");
//                     }
//                 })
//             }
//         }
//     ).then(
//         message => {
//         if (message === "OK") {
//             alert("You can log in ")
//             login_btn.style.display = "block";

//         }} );

// }
  