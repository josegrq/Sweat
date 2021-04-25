const moment = require("moment");

const timestampMessages = (email, msg) => {
  return {
    email,
    msg,
    timestamp: moment().format("h:mm a"),
  };
};

module.exports = timestampMessages;
