//const timestampMessages = require("../utils/timestampMessages");
const {
  userConnected,
  getCurrentUser,
  userLeft,
  getConnectionsForCurrentUser,
  timestampMessages,
} = require("../utils/connections");
const Message = require("../models/message");

module.exports = (io) => {
  /**If you want to show status of user conected to Social Media, you need to add the scripts of chat.ejs to layout.ejs */
  io.on("connection", (socket) => {
    //We will store the current user ID for later use
    let currentUserId;

    //Load all the msgs but for now we are loading general
    //Message.find({})
    //  .sort({ createdAt: -1 })
    //  .limit(10)
    //  .then((messages) => {
    //    console.log(messages);
    //    io.emit("load previous messages", messages.reverse());
    //  });

    //User popped into Messages tab
    socket.on("joined chat", ({ sender, senderEmail, recipient }) => {
      console.log("This is what we get");
      console.log(sender);
      console.log(senderEmail);
      console.log(recipient);
      currentUserId = sender;
      //Add to array of connected users
      userConnected(sender, senderEmail);
      //Join user into unique room with their userid
      socket.join(currentUserId);

      // Load all general chats
      if (recipient === "") {
        console.log("We get to this point");
        Message.find({ general: true })
          .sort({ createdAt: -1 })
          .limit(100)
          .then((messages) => {
            //Are we loading rirght messages?
            console.log("GETTING MSGS");
            console.log(messages);
            io.emit("load previous messages", messages.reverse());
          });
      }
      // Load private chats
      else {
        Message.find({ sender: sender, recipient: recipient })
          .sort({ createdAt: -1 })
          .limit(50)
          .then((messages) => {
            //Are we loading drirght messages?
            //We need to switch the sender and recipient as well and then figure out when they were sent to push them in that order.
            console.log("GETTING MSGS");
            console.log(messages);
            //io.emit("load previous messages", messages.reverse());
          });
      }
      //Send to EVERYONE
      //socket.emit("message", "Welcome");

      //Send to everyone, but self
      //socket.broadcast.emit("message", "user joined");

      //Private messages
      socket.on("private message", ({ content, to, from }) => {
        console.log("THIS IS WAHT WE GET");
        console.log(content);
        console.log(to);
        console.log(from);

        let newMessage = new Message({
          msg: content,
          sender: from,
          recipient: to,
          general: false,
        });
        newMessage
          .save()
          .then(() => {
            console.log("We get NO ERROR 1");
            User.findById(from)
              //We are sending all info from sender for now
              /**We received the content of the NEW msg and we need to store it in the DB.
               *
               * After this, we need to grab all the msgs that correspond to these users
               * and send list of msgs to populate
               */
              .then((senderInfo) => {
                console.log("We get NO ERROR 2");
                io.to(to).emit("private message", {
                  msg: content,
                  from: senderInfo,
                });
              })
              .catch((err) => {
                console.log("We get ERROR 1");
                console.log(err);
              });
          })
          .catch((error) => {
            console.log("We get ERROR 2");
            console.log(error);
          });
      });
    });

    //New Chat
    socket.on("chat", ({ content, to, from }) => {
      let newMessage = new Message({
        msg: content,
        //  email: msjObj.email,
        sender: from,
        general: true,
      });
      newMessage
        .save()
        .then(() => {
          User.findById(from).then((senderInfo) => {
            //We might use
            console.log(senderInfo);
            io.emit("chat", timestampMessages(content, from));
          });
        })
        .catch((error) => {
          console.log(`ERROR: ${error.message}`);
        });
      //console.log(msjObj.msg);
    });

    //Disconnected
    socket.on("disconnect", () => {
      //user disconnected so remove from array
      userLeft(currentUserId);
    });
  });
};
