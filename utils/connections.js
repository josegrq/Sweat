const User = require("../models/user");
const moment = require("moment");

const users = [];

const userConnected = (id, email) => {
  users.push({ id, email });
};

//const timestampMessages = (email, msg) => {
//  return {
//    email,
//    msg,
//    timestamp: moment().format("h:mm a"),
//  };
//};
const timestampMessages = (msg, id) => {
  return {
    msg,
    id,
    timestamp: moment().format("h:mm a"),
  };
};

const getCurrentUser = (id) => {
  return users.find((user) => user.id === id);
};

//Will return the user that left
const userLeft = (id) => {
  const userIndex = users.findIndex((user) => user.id === id);
  if (userIndex !== -1) {
    return users.splice(userIndex, 1)[0];
  }
};

//This function will not work yet as we need to modify the User schema
const getConnectionsForCurrentUser = (id) => {
  User.findById(id)
    .then((user) => {
      return user.connections;
    })
    .catch((error) => {
      console.log(`ERROR: ${error.message}`);
    });
};

module.exports = {
  userConnected,
  getCurrentUser,
  userLeft,
  getConnectionsForCurrentUser,
  timestampMessages,
};
