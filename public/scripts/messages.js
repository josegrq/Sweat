$(document).ready(() => {
  var socket = io();
  var form = document.getElementById("messages-form");
  var input = document.getElementById("input-message");
  var messages = document.getElementById("messages-view");

  const userID = window.location.pathname.split("/")[2];
  socket.emit("joined chat", userID);

  //To server
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (input.value) {
      socket.emit("chat", input.value);
      input.value = "";
      input.focus();
    }
  });

  //From server
  socket.on("chat", (msg) => {
    var messageItem = document.createElement("li");
    messageItem.textContent = msg;
    messages.appendChild(messageItem);
    window.scrollTo(0, document.body.scrollHeight);
  });

  //We are getting a list of users which are connections to logged in user
  socket.on("users", (users) => {
    console.log(users);
  });

  socket.on("private message", ({ content, from }) => {
    //Get user from list of users "connections"
    for (let i = 0; i < this.users.length; i++) {
      const user = this.users[i];
      if (user.userID === from) {
        user.messages.push({
          content,
          fromSelf: false,
        });
        if (user !== this.selectedUser) {
          user.hasNewMessages = true;
        }
        break;
      }
    }
  });

  socket.on("connect", () => {
    //this.users.forEach((user) => {
    //  if (user.self) {
    //    user.connected = true;
    //  }
    //});
  });

  socket.on("disconnect", () => {
    //this.users.forEach((user) => {
    //  if (user.self) {
    //    user.connected = false;
    //  }
    //});
  });

  function onSelectedUser(content) {
    //Need to get user selected info here
    //TODO

    if (selectedUser) {
      socket.emit("private message", {
        content,
        to: "selected user emal goes here",
        //to: this.selectedUser.userID,
      });
      //this.selectedUser.messages.push({
      //  content,
      //  fromSelf: true,
      //});
    }
  }
});
