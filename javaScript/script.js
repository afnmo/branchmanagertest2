function checkPassword(){
  let password = document.getElementById("password").value;
  let cnfrmPassword = document.getElementById("cnfrm-password").value;
  // console.log(" Password:", password,'\n',"Confirm Password:",cnfrmPassword);
  let message = document.getElementById("message");

  if(password.length != 0){
      if(password == cnfrmPassword){
          message.textContent = "Passwords match";
          message.style.backgroundColor = "#1dcd59";
          showAlert("you are created password!");

          //////////////////
          youcanlogin();
      }
      else{
          message.textContent = "Password don't match";
          message.style.backgroundColor = "#ff4d4d";
      }
  }
  else{
    showAlert("Password can't be empty!");
      message.textContent = "";
  }
}

//////////////////////////////////
function youcanlogin(){
  message => {
      if (message === "OK") {
        showAlert("You can log in ")
          login_btn.style.display = "block";

      }}
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