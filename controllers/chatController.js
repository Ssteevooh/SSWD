const Chat = require('../models/chat');
const moment = require('moment');

module.exports = {
    index: (req, res, next) => {
        Chat.findOne({date: moment().format(process.env.dateFormat)})
        .then(chat => {
          console.log(`${res.locals.currentUser !== undefined ? res.locals.currentUser.fullname : 'a user'} connected`);
          if (!chat) {
            res.locals.messages = [];
            next();
          }
          else {
            res.locals.messages = chat.messages;
            next();
          }
        })
        .catch(error => {
          console.log(`Error fetching chat logs: ${error.message}`);
          res.locals.messages = [];
          next();
        });
    },
    indexView: (req, res) => {
      res.render("chat/index", {
        user: res.locals.currentUser !== undefined ? res.locals.currentUser.fullname : 'Anonymous',
        messages: res.locals.messages
      });
    },
    saveMessage: (msg, time) => {
      Chat.findOne({date: moment().format(process.env.dateFormat)})
      .then(chat => {
        if (chat){
          chat.messages.push({
            user: msg.user,
            message: msg.msg,
            messageDate: moment().format(),
            clock: time
          });
          chat.save();
        } else {
          Chat.create({
            date: moment().format(process.env.dateFormat),
            messages: [{
              user: msg.user,
              message: msg.msg,
              messageDate: moment().format(),
              clock: time
            }]
          })
          .then(chat => {
            console.log(`Added new chat date ${chat.date}`);
          })
          .catch(error => {
            console.log(`Error saving message: ${error.message}`);
          });
        }
      })
      .catch(error => {
        console.log(`Error fetching chat log: ${error.message}`);
      });
    }
  };

