const socket = new WebSocket('ws://localhost:3000');
socket.onmessage = handleServerMessage;


function sendMessageToServer(message) {
    socket.send(message);
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
  
      const data = canvas.toDataURL("image/png");
      photo.setAttribute("src", data);
      console.log(data);
    } 
  }
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
            const gameOver = {type: 'victory'};
            sendMessageToServer(JSON.stringify(gameOver)); // send gameover message to server indicating that this player has lost
        }
    }
    const isHit = playerBoard[y][x]
    const response = { type: 'response', message: isHit, x: x, y: y}; // Send response back to server with whether the shot was a hit or miss and the coordinates corresponding
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
////////// API CALLS

const PAT = '095a52b8d68a49a9bc38a58fd282075a';
const USER_ID = 'clarifai';       
const APP_ID = 'main';
const MODEL_ID = 'food-item-recognition';
const MODEL_VERSION_ID = '1d5fd481e0cf4826aa72ec3ff049e044';    
const IMAGE_URL = 'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcT8AS3Q4CAzi8xMe5NaAZ_WfjLlioGWzRURdfAWRu-Lprqex2xf';

const raw = JSON.stringify({
    "user_app_id": {
        "user_id": USER_ID,
        "app_id": APP_ID
    },
    "inputs": [
        {
            "data": {
                "image": {
                    "url": IMAGE_URL
                }
            }
        }
    ]
});

const requestOptions = {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Authorization': 'Key ' + PAT
    },
    body: raw
};

fetch("https://api.clarifai.com/v2/models/" + MODEL_ID + "/versions/" + MODEL_VERSION_ID + "/outputs", requestOptions)
    .then(response => response.json())
    .then(result => {
        // Find the concept with the highest confidence
        const concepts = result.outputs[0].data.concepts;
        const highestConfidence = concepts.reduce((max, concept) => concept.value > max.value ? concept : max, concepts[0]);

        // Output the concept with the highest confidence
        console.log('Concept with highest confidence:', highestConfidence);
    })
    .catch(error => console.log('error', error));
