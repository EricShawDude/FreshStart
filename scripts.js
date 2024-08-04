const socket = new WebSocket('ws://localhost:3000');
socket.onmessage = handleServerMessage;


function sendMessageToServer(message) {
    socket.send(message);
}


function handleServerMessage(event) {
    const message = JSON.parse(event.data);

    switch (message.type) {
        case 'test':
            console.log(message.message);
            changeSessionID(message.session);
            break;
        
        case 'victory':// If the player receives a victory message
            console.log(`Test! ${message}`);
            const defeat = { type: 'defeat' } // Send indiciation that other side has lost to other player
            sendMessageToServer(JSON.stringify(defeat));
            alert("You win!");
            break;

    }
}

//Slideshow Gallery 
let slideIndex = 1;
showSlides(slideIndex);

function plusSlides(n) {
  showSlides(slideIndex += n);
}

function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  let i;
  let slides = document.getElementsByClassName("mySlides");
  let dots = document.getElementsByClassName("dot");
  if (n > slides.length) {slideIndex = 1}    
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";  
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex-1].style.display = "block";  
  dots[slideIndex-1].className += " active";
}

/// IMAGE TAKER
const fs = require('fs');

function takepicture() {
  var width = document.getElementById('vid').offsetWidth;
  var height = document.getElementById('vid').offsetHeight;
  console.log(width);
  console.log(height);
  canvas = document.getElementById('canvas')
  const context = canvas.getContext("2d");
  if (width && height) {
    canvas.width = width;
    canvas.height = height;
    context.drawImage(vid, 0, 0, width, height);

    const data = canvas.toDataURL("image/png");
    console.log(data);

    writeImage(data, "C:/Github/ScammerJammerTest/Hackashaw/images")
  } 
}

function writeImage(dataUrl, filePath) {
  try {
      // Extract the base64 data part from the data URL
      const base64Data = dataUrl.split(',')[1];

      // Decode the base64 data into a buffer
      const buffer = Buffer.from(base64Data, 'base64');

      // Write the buffer to the specified file path
      fs.writeFileSync(filePath, buffer);

      console.log('Image saved successfully to', filePath);
  } catch (error) {
      console.error('Error saving image:', error);
  }
}


//// helper func
/// START HELPER FUNCTION
function changeSessionID(newText) {
    // Select the element with class "session"
    const element = document.querySelector('h2.session');
    
    // Check if the element exists
    if (element) {
      // Update the text content
      element.innerText = newText;
    } else {
      console.error('Element with class "session" not found.');
    }
  }