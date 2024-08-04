const socket = new WebSocket('ws://localhost:3000');
socket.onmessage = handleServerMessage;


function sendMessageToServer(message) {
    socket.send(message);
}


function handleServerMessage(event) {
  const message = JSON.parse(event.data);
  console.log('Received message:', message.message);

  switch (message.type) {
      case 'start': // Starts the game 
          console.log('Game started:', message.message);
          break;
      case 'test':
          console.log('Test message:', message.message);
          break;
      case 'foodReturn':
          updateFoodList(message.dataOut);
          break;
      case 'recipe':
            updateRecipeContent(message.message);
            break;
      case 'lifespan':
        updateLifespan(message.message);
        break;
      case 'storage':
        updateStorage(message.message);
        break;

      default:
          console.log('Unknown message type:', message.type);
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
    file = dataURLToFile(data, "image.png");
    link = uploadImage(file);
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
      //console.log('Full API Response:', data);  // Log the full response to inspect it

      if (data.success) {
          console.log('Image uploaded:', data.data.link);
          sendMessageToServer(JSON.stringify({ type: 'link', message: data.data.link})) ;
      } else {
          console.error('Upload failed:', data.data.error);
      }
  } catch (error) {
      console.error('Error uploading image:', error);
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


function updateFoodList(foodNames) {
    const foodsDiv = document.getElementById('foods');
    if (foodsDiv) {
        if (Array.isArray(foodNames)) {
            console.log('Received array of food names:');
            
            // Create a list of food names
            const foodList = foodNames.map(foodName => `<li>${foodName}</li>`).join('');
            
            // Replace the content of the div with the list
            foodsDiv.innerHTML = `<ul>${foodList}</ul>`;
        } else {
            console.log('Expected an array but received:', foodNames);
            foodsDiv.innerHTML = '<p>No food items available.</p>';
        }
    } else {
        console.error('Div with id "foods" not found.');
    }
}

function updateRecipeContent(recipeMessage) {
  const helpImageDiv = document.getElementById('helpImageR');
  const helpImageDiv2 = document.getElementById('helpImageR2');
  
  if (helpImageDiv) {
      // Process the recipeMessage to format text
      let formattedMessage = recipeMessage;

      // Replace **text** with <strong>text</strong>
      formattedMessage = formattedMessage.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

      // Add a newline after periods, colons, and closed parentheses, but not if there's a number before the period
      formattedMessage = formattedMessage
          .replace(/([^\d])(\.|\:|\)\s*)/g, '$1$2<br/>')  // After periods, colons, and closing parentheses
          .replace(/\.\s*(?!\d)/g, '.<br/>');  // Ensure no newline if number precedes period

      // Replace the content of the div with the formatted recipe message
      helpImageDiv.innerHTML = `<p style="text-align: left; margin-left: 100px;">${formattedMessage}</p>`;
  } else {
      console.error('Div with id "helpImageR" not found.');
  }

  if (helpImageDiv2) {
      // Hide the second div
      helpImageDiv2.style.visibility = 'hidden';
  } else {
      console.error('Div with id "helpImageR2" not found.');
  }
}

function updateLifespan(lifespanMessage) {
  element = document.getElementById('lifespan');
  element.innerHTML = `<p>Lifespan: ${lifespanMessage}</p>`;

};


