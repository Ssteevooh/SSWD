require('dotenv').config();
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const moment = require('moment');
const mongoose = require("mongoose");
const User = require("./models/user");
const Chat = require("./models/chat");
const chatController = require('./controllers/chatController');
const passport = require("passport");
const router = require("./routes")


mongoose.Promise = global.Promise;

mongoose.connect(process.env.DB_URL, { useNewUrlParser: true });

const db = mongoose.connection;

db.once("open", (err) => {
  if(err) {
    console.error(err);
  }
  console.log(`Database started`);
});

app.set('port', process.env.PORT || 3000);

app.set('view engine', 'ejs');

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

io.on('connection', (socket) => {
  console.log('Connected to chat');
  socket.on('chat message', async (msg) => {
    const messageDate = moment().format('LT');
    chatController.saveMessage(msg, messageDate)
    const newMessage = `${messageDate} | ${msg.user} : ${msg.msg}`;
    Chat.findOne({date: moment().format(process.env.dateFormat)})
      .then(chat => {
        dbMessages = chat ? chat.messages : [];
        io.emit('chat message', newMessage, dbMessages);
    }).catch((error) => {
      console.log(error.messages);
      io.emit('chat message', '', []);
    })
  });
  socket.on('disconnect', () => {
    console.log('Disconnected from chat');
  });
});

app.use("/", router);

server.listen(
    app.get('port'),
    () => {console.log(`Server is listening to PORT ${app.get('port')}`)}
);
