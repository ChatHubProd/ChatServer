const express = require('express');
const app = express();
const port = 3000;
const http = require("http");
const socketIo = require('socket.io');


const router = express.Router();


var mongo = require('mongodb');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://ChatHub:TripNavigation@cluster0.msosy.mongodb.net/ChatHub?retryWrites=true&w=majority";




const server = app.listen(port, () => {
    console.log(`Server connection on  http://127.0.0.1:${port}`);  // Server Connnected
});
// Creo un oggetto socketServer sopra  il server Http
socketServer = socketIo(server);




app.get('/', function (req, res, next) {
    res.json({
        user: "pinco pallino"
    });
});

        app.get('/requestoldmsg/:cnl', function (req, res, next) {
            cnl = req.params.cnl;
            MongoClient.connect(url, function (err, db) {
                if (err) throw err;
                var dbo = db.db("ChatHub");
                dbo.collection(cnl).find().toArray(function (err, results) {
                    if (err) throw err;
                    this.result = results;
                    res.send(result)
                    db.close();
                });
            });
        });








// Per ogni client connesso
socketServer.on('connection', socket => {
    console.log('Socket: client connected');
    //Invio il messaggio ricevuto a tutti i client
    socket.on('change-channel', (nick, cnl) => {
        socket.join(cnl);
        console.log(nick, cnl);
    });


    socket.on('new-message', (nick, msg, cnl) => {
        let message = { "nickname": nick, "message": msg, "channel": cnl }
        MongoClient.connect(url, function (err, db) {
            if (err) throw err;
            var dbo = db.db("ChatHub");
            dbo.collection(cnl).insertOne(message, function (err, res) {
                if (err) throw err;
                console.log("1 document inserted " + "in " + cnl + " by " + nick);
                db.close();
            });
            socketServer.to(cnl).emit('resp-message', message);
            console.log(message);
        });
    });
});