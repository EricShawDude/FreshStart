// DATABASE CONNECTIONS
var mysql = require('mysql');

// too lazy to make env file, dont steal please :)
var con = mysql.createConnection({
  host: "db-buf-05.sparkedhost.us",
  user: "u132904_RJbVrqE9qR",
  password: "tNqe4!avJmtVc6IzFk4xd!O9",
  database: "s132904_Hack_Database"
});

con.connect(function(err) {
  if (err) {
    return callback(err); 
  }
  console.log("SQL DB Connected!")
});

let globalNextOrderNumber;

function pullSession(callback) { 
  const sql = "SELECT MAX(orderNumber) AS latestOrderNumber FROM `Food`";

  con.query(sql, (err, result) => {
    if (err) {
      return callback(err); 
    }
    
    globalNextOrderNumber = (result[0].latestOrderNumber === null ? 1 : result[0].latestOrderNumber + 1);
    callback(null, globalNextOrderNumber); 
  });
}

pullSession((err, nextOrderNumber) => {
  if (err) {
    console.error('Error retrieving session ID:', err);
  } else {
    globalNextOrderNumber = nextOrderNumber;
    console.log('Next order number:', globalNextOrderNumber);
  }
});


function insertFood(orderNumber, foodName) {
  const sql = "INSERT INTO Food (orderNumber, food) VALUES (?, ?)";
  const values = [orderNumber, foodName];

  return new Promise((resolve, reject) => {
      con.query(sql, values, (err, result) => {
          if (err) {
              return reject(err); // Reject the promise if there's an error
          }
          console.log("1 record inserted with ID:", result.insertId); // Log the auto-incremented ID
          resolve(result); // Resolve the promise with the result
      });
  });
}

async function getRecordsByOrderNumber(orderNumber) {
  const sql = "SELECT * FROM Food WHERE orderNumber = ?";
  const values = [orderNumber];

  return new Promise((resolve, reject) => {
      con.query(sql, values, (err, results) => {
          if (err) {
              return reject(err); // Reject the promise if there's an error
          }
          resolve(results); // Resolve the promise with the results
      });
  });
}


async function fetchOrderFoodNames() {
  try {
      const records = await getRecordsByOrderNumber(globalNextOrderNumber); // Pass the order number you need
      console.log('Fetched records:', records); // Log the records to check their structure
      
      // Extract food names from the records
      const foodNames = records.map(record => record.food);
      //console.log('Extracted food names:', foodNames);
      
      return foodNames; // Return the array of food names
  } catch (error) {
      console.error('Error retrieving food names:', error);
      return []; // Return an empty array in case of an error
  }
}


// END DATABASE CONNECTIONS

// OPENAI WRAPPER
const { OpenAI } = require('openai');


const openai = new OpenAI({ apiKey: 'sk-nj-BBJ9HhPT76iK4jvDMN7WEaSSqrRDiJTK9k_f2QUT3BlbkFJNb89loFYfoL812Zi83YByCSHI55_fJdLvdAkWMi2oA' });

async function getRecipeRecommendation(foodNames) {
  const prompt = `Based on the following ingredients, recommend a recipe. Try to use as little ingredients as possible on top of what's provided. Only provide the recipe: ${foodNames.join(', ')}.`;

  try {
      const response = await openai.chat.completions.create({
          model: "gpt-4o-mini", 
          messages: [{ role: 'user', content: prompt }],
      });

      // Extract the recommended recipe from the response
      const recipe = response.choices[0].message.content;
      console.log('Recommended Recipe:', recipe);
      return recipe;
  } catch (error) {
      console.error('Error generating recipe:', error);
  }
}

async function getLifespan(foodNames) {
  const prompt = `Provide the average lifespan of the following food: ${foodNames}. Format properly. As well, provide a storage method that is a one or two sentences long.`;

  try {
      const response = await openai.chat.completions.create({
          model: "gpt-4o-mini", 
          messages: [{ role: 'user', content: prompt }],
      });

      // Extract the recommended recipe from the response
      const lifespan = response.choices[0].message.content;
      console.log('Lifespan:', lifespan);
      return lifespan;
  } catch (error) {
      console.error('Error generating recipe:', error);
  }
}






//
//  WEBSOCKET START
const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });


wss.on('connection', (ws) => {
  ws.send(JSON.stringify({type: 'test', message: 'Server connected.'}))




  ws.on('message', async (message) => {
    try {
        const parsedMessage = JSON.parse(message);
        console.log('Received:', parsedMessage);

        switch (parsedMessage.type) {
                
            case 'link':
                const highestConfidenceConcept = await getHighestConfidenceConcept(parsedMessage.message);
                insertFood(globalNextOrderNumber, highestConfidenceConcept);
                const foodData = await fetchOrderFoodNames();

                ws.send(JSON.stringify({type: 'foodReturn', message: highestConfidenceConcept, dataOut: foodData}));

                const recipe = await getRecipeRecommendation(foodData);

                ws.send(JSON.stringify({type: 'recipe', message: recipe}));

                const lifespan = await getLifespan(highestConfidenceConcept);

                ws.send(JSON.stringify({type: 'lifespan', message: lifespan}));

                break;
                
            case 'victory': // If the player receives a victory message
              ws.send(JSON.stringify({type: 'ah', message: 'Server connected.'}))
              break;
                
        }

    } catch (error) {
        console.error('Invalid JSON:', message);
        // Optionally send an error message back to the client
        ws.send(JSON.stringify({ error: 'Invalid JSON format' }));
    }
});
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

async function getHighestConfidenceConcept(imageURL) {
    const raw = JSON.stringify({
        "user_app_id": {
            "user_id": USER_ID,
            "app_id": APP_ID
        },
        "inputs": [
            {
                "data": {
                    "image": {
                        "url": imageURL
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

    try {
        const response = await fetch("https://api.clarifai.com/v2/models/" + MODEL_ID + "/versions/" + MODEL_VERSION_ID + "/outputs", requestOptions);
        const result = await response.json();

        // Extract concepts array
        const concepts = result.outputs[0].data.concepts;

        // Find the concept with the highest confidence
        const highestConfidence = concepts.reduce((max, concept) => concept.value > max.value ? concept : max, concepts[0]);

        // Extract the name of the concept with the highest confidence
        const highestConfidenceName = highestConfidence.name;

        // Output the name of the concept with the highest confidence
        console.log(highestConfidenceName);

        return highestConfidenceName;
    } catch (error) {
        console.log('error', error);
        throw error;
    }
}

// Example usage



