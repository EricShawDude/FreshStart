const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const multer = require('multer');
const path = require('path');

const port = 3000;
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
      cb(null, file.originalname);
  }
});

const upload = multer({ storage });

app.post('/upload', upload.single('image'), (req, res) => {
  res.send(`File uploaded: <a href="/uploads/${req.file.filename}">${req.file.filename}</a>`);
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

wss.on('connection', (ws) => {
  console.log('Connected 1 ');

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

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
