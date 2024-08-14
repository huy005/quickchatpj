const formatTime = require("date-format");

const createMessages = (messageText, username) => {
  return {
    messageText,
    username,
    createdAt: formatTime("yyyy/MM/dd - hh:mm:ss", new Date()),
  };
};

module.exports = {
  createMessages,
};
