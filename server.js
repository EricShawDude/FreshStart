// DATABASE CONNECTIONS
var mysql = require('mysql');

var con = mysql.createConnection({
  host: "db-buf-05.sparkedhost.us",
  user: "u132904_RJbVrqE9qR",
  password: "tNqe4!avJmtVc6IzFk4xd!O9"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

function pullSession(){
  // connect to db
  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
  });

  

}

function insertFood(orderNumber,imageNumber,foodName,expDate , ) {
  // Connect to the database
  con.connect(function(err) {
    if (err) {
      return callback(err); // Pass error to the callback
    }
    console.log("Connected!");

    // Prepare the SQL query
    const sql = "INSERT INTO Food (orderNumber, imageNumber, foodName, expDate) VALUES (?,?,?, ?)";
    const values = [orderNumber,imageNumber,foodName,expDate ];

    // Execute the query
    con.query(sql, values, function (err, result) {
      if (err) {
        return callback(err); // Pass error to the callback
      }
      console.log("1 record inserted");
      callback(null, result); // Pass result to the callback
    });
  });
}



// END DATABASE CONNECTIONS

//  WEBSOCKET START
const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  console.log('Connected 1 ');

  // Optionally, you can set up event handlers for the WebSocket connection
        const parsedMessage = JSON.parse(message);
        console.log('Received message:', parsedMessage);

  ws.on('close', () => {
    console.log('Connection closed');
  });

  // Optionally, you can send a message to the client
  ws.send(JSON.stringify({type: 'start', message: 'Connected' }));
});

const port = 3000;
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
// END WEBSOCKET 

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
        // Extract concepts array
        const concepts = result.outputs[0].data.concepts;

        // Find the concept with the highest confidence
        const highestConfidence = concepts.reduce((max, concept) => concept.value > max.value ? concept : max, concepts[0]);

        // Extract the name of the concept with the highest confidence
        const highestConfidenceName = highestConfidence.name;

        // Output the name of the concept with the highest confidence
        console.log(highestConfidenceName);
    })
    .catch(error => console.log('error', error));

