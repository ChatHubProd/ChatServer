const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
const port = 3000;
const socketIo = require('socket.io');

// Send Notification API
app.get('/send-notification', (req, res) => {
    const notify = {data: req.body};
    socketServer.emit('notification', notify); // Updates Live Notification
    res.send(notify);
});

const server = app.listen(port, () => {
  console.log(`Server connection on  http://127.0.0.1:${port}`);  // Server Connnected
});
// Socket Layer over Http Server
socketServer = socketIo(server);

// On every Client Connection
socketServer.on('connection', socket => {
    console.log('Socket: client connected');

    socket.on('new-message', (message) => {
      socketServer.emit('resp-message', message);
      console.log(message);
    });
});