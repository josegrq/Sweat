$(document).ready(() => {
  const URL = "http://localhost:3000";
  const socket = io(URL, { autoConnect: false });
  var form = document.getElementById("messages-form");
  var input = document.getElementById("input-message");
  var messages = document.getElementById("messages-view");
  var sendButton = document.getElementById("send-button");

  //We get the ID and EMAIL and RECEIVER
  const userID = document.getElementById("current-user-id").value;
  const userEmail = document.getElementById("current-user-email").value;
  const recipient = document.getElementById("recipient-id").value;

  //Connect to server
  socket.connect();

  //Catch all listener
  socket.onAny((event, ...args) => {
    console.log("CATCH ALL LISTENER");
    console.log(event, args);
  });

  //ERROR HANDLER upon connection failure
  socket.on("connect_error", (err) => {
    //You can send an error with custom name
    if (err.message === "invalid username") {
      //this.usernameAlreadySelected = false;
      console.log("DO SOMETHIng WITH ERROR");
    }
  });

  //When ever user comes into chat tab this emits
  socket.emit("joined chat", {
    sender: userID,
    senderEmail: userEmail,
    recipient: recipient,
  });

  const emitToGeneralChat = () => {
    socket.emit("chat", {
      content: input.value,
      to: recipient,
      from: userID,
      // Might not need email
    });
  };

  //When form is submitted
  //PRESS ENTER
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (input.value) {
      // General Chat
      if (recipient === "") {
        console.log("IS PUBLIC");
        emitToGeneralChat();
      }
      // Private Chat
      else {
        // Chats need to be saved into DB on server side
        console.log("IS PRIVATE");
        emitPrivateChat();
      }
      input.value = "";
      input.focus();
    }
  });
  //PRESS BUTTON
  sendButton.addEventListener("click", () => {
    if (input.value) {
      const recipient = document.getElementById("recipient-id").value;

      // General Chat
      if (recipient === "") {
        console.log("IS PUBLIC");
        emitToGeneralChat();
      }
      // Private Chat
      else {
        // Chats need to be saved into DB on server side
        console.log("IS PRIVATE");
        emitPrivateChat();
      }
      input.value = "";
      input.focus();
    }
  });

  //From server
  // Populate new message to chat box
  socket.on("chat", (msgObj) => {
    var messageItem = document.createElement("p");
    messageItem.textContent = msgObj.msg;
    if (msgObj.sender === userID) {
      messageItem.classList.add("right-align");
    } else {
      messageItem.classList.add("left-align");
    }
    messages.appendChild(messageItem);
    window.scrollTo(0, document.body.scrollHeight);
  });

  // Populate previous messages
  socket.on("load previous messages", (msgs) => {
    //const userID = document.getElementById("current-user-id").value;
    //console.log("PREVIOUS MESSAGES");
    //console.log(msgs);
    msgs.forEach((msg) => {
      //var divItem = document.createElement("div");
      var messageItem = document.createElement("p");
      messageItem.textContent = msg.msg;
      //divItem.appendChild(messageItem);
      if (msg.sender === userID) {
        messageItem.classList.add("right-align");
      } else {
        messageItem.classList.add("left-align");
      }
      messages.appendChild(messageItem);
      //SCROLL NOT WORKING
      window.scrollTo(0, document.body.scrollHeight);
    });
  });

  //We are getting a list of users which are connections to logged in user
  //socket.on("users", (users) => {
  //  console.log(users);
  //});

  //NEEDS IMPLEMENTARTION (SOCKET.IO)
  socket.on("private message", ({ msg, from }) => {
    //Populate the msgs
    console.log("THIS IS WHAT WE GET");
    console.log(msg);
    console.log(from);
    var messageItem = document.createElement("li");
    messageItem.textContent = msg;
    messages.appendChild(messageItem);
    window.scrollTo(0, document.body.scrollHeight);
  });

  //socket.on("connect", () => {
  //this.users.forEach((user) => {
  //  if (user.self) {
  //    user.connected = true;
  //  }
  //});
  //});

  //socket.on("disconnect", () => {
  //this.users.forEach((user) => {
  //  if (user.self) {
  //    user.connected = false;
  //  }
  //});
  //});

  const emitPrivateChat = () => {
    // Chats need to be saved into DB on server side
    socket.emit("private message", {
      content: input.value,
      to: recipient,
      from: userID,
    });
  };
});
