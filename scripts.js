const socket = new WebSocket('ws://localhost:3000');
socket.onmessage = handleServerMessage;


function sendMessageToServer(message) {
    socket.send(message);
}

const fs = require('fs');

function playerMove(x, y) {
    if (playerBoard[y][x] === 0) {
        playerBoard[y][x] = 3; // Mark as miss
        drawBoards();
    } else if (playerBoard[y][x] === 1) {
        playerBoard[y][x] = 2; // Mark as hit
        drawBoards();
        if (checkGameOver(playerShips, playerBoard)) {
            alert("You lose!");
            canvas.removeEventListener('click', handleCanvasClick);
            const gameOver = { type: 'victory' };
            sendMessageToServer(JSON.stringify(gameOver)); // send gameover message to server indicating that this player has lost
        }
    }
    const isHit = playerBoard[y][x]
    const response = { type: 'response', message: isHit, x: x, y: y }; // Send response back to server with whether the shot was a hit or miss and the coordinates corresponding
    console.log(`${isHit}, Coords: ${x}, ${y}`)
    sendMessageToServer(JSON.stringify(response));
    isPlayerTurn = false; // Change turns
}

function handleServerMessage(event) {
    const message = JSON.parse(event.data);

    switch (message.type) {
        case 'start': // Starts the game 
            console.log(message.message);
            break;
        case 'test':
            console.log(message.message)
            break;
        
        case 'victory':// If the player receives a victory message
            canvas.removeEventListener('click', handleCanvasClick);
            console.log(`Player wins! ${message}`);
            const defeat = { type: 'defeat' } // Send indiciation that other side has lost to other player
            sendMessageToServer(JSON.stringify(defeat));
            alert("You win!");
            break;

        case 'defeat':// If the player receives a defeat message
            canvas.removeEventListener('click', handleCanvasClick);
            console.log(`You lose! ${message}`);
            alert("You Lose!");
            break;

    }
}


// IMAGE TAKER 

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

    const data = canvas.toDataURL("image/jpeg");
    console.log(data);
    file = dataURLToFile(data, "image.png");
    link = uploadImage(file);
    console.log(link.toString())
    console.log("LINK !!!!")
    return link;
  } 
}

function dataURLToFile(dataURL, filename) {
  // Split the data URL into the content type and the base64 data
  const [header, base64Data] = dataURL.split(',');
  const mimeType = header.match(/:(.*?);/)[1];
  const byteString = atob(base64Data);

  // Convert the base64 string to an array of bytes
  const arrayBuffer = new ArrayBuffer(byteString.length);
  const uint8Array = new Uint8Array(arrayBuffer);

  for (let i = 0; i < byteString.length; i++) {
      uint8Array[i] = byteString.charCodeAt(i);
  }

  // Create a Blob from the byte array and mime type
  const blob = new Blob([uint8Array], { type: mimeType });

  // Convert Blob to File if needed
  const file = new File([blob], filename, { type: mimeType });

  return file;
}

async function uploadImage(file) {
  const formData = new FormData();
  formData.append('image', file);

  try {
      const response = await fetch('https://api.imgur.com/3/image', {
          method: 'POST',
          headers: {
              'Authorization': 'Client-ID 1d706103fe31284'
          },
          body: formData
      });

      const data = await response.json();
      console.log('Full API Response:', data);  // Log the full response to inspect it

      if (data.success) {
          console.log('Image uploaded:', data.data.link);
          return data.data.link;
      } else {
          console.error('Upload failed:', data.data.error);
      }
  } catch (error) {
      console.error('Error uploading image:', error);
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

function handleServerMessage(event) {
  const message = JSON.parse(event.data);

  switch (message.type) {
      case 'start': // Starts the game 
          console.log(message.message);
          break;
      
      case 'victory':// If the player receives a victory message
          canvas.removeEventListener('click', handleCanvasClick);
          console.log(`Player wins! ${message}`);
          const defeat = { type: 'defeat' } // Send indiciation that other side has lost to other player
          sendMessageToServer(JSON.stringify(defeat));
          alert("You win!");
          break;

      case 'defeat':// If the player receives a defeat message
          canvas.removeEventListener('click', handleCanvasClick);
          console.log(`You lose! ${message}`);
          alert("You Lose!");
          break;

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
