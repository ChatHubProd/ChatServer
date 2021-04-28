const express = require('express');
const app = express();
const port = 3000;
const socketIo = require('socket.io');

const server = app.listen(port, () => {
  console.log(`Server connection on  http://127.0.0.1:${port}`);  // Server Connnected
});
// Creo un oggetto socketServer sopra  il server Http
socketServer = socketIo(server);

// Per ogni client connesso
socketServer.on('connection', socket => {
    console.log('Socket: client connected');
    //Invio il messaggio ricevuto a tutti i client
    socket.on('new-message', (nick, msg, cnl) => {
      let msgobj = {"nickname": nick, "message": msg, "channel": cnl};
      socketServer.emit('resp-message', msgobj);
      console.log(msgobj);
    });
});