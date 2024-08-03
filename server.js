const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  console.log('Connected');

  // Optionally, you can set up event handlers for the WebSocket connection
  ws.on('message', (message) => {
    console.log(`Received message => ${message}`);
  });

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
