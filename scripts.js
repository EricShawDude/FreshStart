

const socket = new WebSocket('ws://localhost:3000');
socket.onmessage = handleServerMessage;


function sendMessageToServer(message) {
    socket.send(message);
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


