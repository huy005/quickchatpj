const express = require("express");
const app = express();
const path = require("path");
const http = require("http");
const socketIo = require("socket.io");
const Filter = require("bad-words");
const { createMessages } = require("./utils/create-message");
const { getUserList, addUser, removeUser, findUser } = require("./utils/users");

const publicPathDirectory = path.join(__dirname, "../public");
app.use(express.static(publicPathDirectory));
const server = http.createServer(app);
const io = socketIo(server);

// Get connection event from io() of index.html
io.on("connection", (socket) => {
  // Deviding rooms
  socket.on("join room c2s", ({ username, room }) => {
    socket.join(room);
    // Send a message to client just entered the chat room
    socket.emit(
      "send messages s2c",
      createMessages(`${room}へようこそ！！！`, "Admin")
    );

    socket.broadcast
      .to(room)
      .emit(
        "send messages s2c",
        createMessages(`${username}が${room}に入った！！！`, "Admin")
      );

    const id = socket.id;

    // Sending messages with bad words prevention
    socket.on("send messages c2s", (messageText, callback) => {
      const filter = new Filter();
      filter.addWords("bad");
      if (filter.isProfane(messageText)) {
        return callback("メッセージは悪い言葉が入ってる。");
      }
      const user = findUser(id);
      io.to(room).emit(
        "send messages s2c",
        createMessages(messageText, user.username)
      );
      callback();
    });

    // Sharing location
    socket.on("share location c2s", (latitude, longitude) => {
      const sharingUrl = `http://www.google.com/maps?q=${latitude},${longitude}`;
      const user = findUser(id);
      io.to(room).emit(
        "share location s2c",
        createMessages(sharingUrl, user.username)
      );
    });

    // Adding User
    const newUser = {
      id: id,
      username: username,
      room: room,
    };
    addUser(newUser);
    // Sending user list from server to client
    io.to(room).emit("send user list s2c", getUserList(room));

    // The client logged out or was disconnected
    socket.on("disconnect", () => {
      removeUser(socket.id);
      io.to(room).emit("send user list s2c", getUserList(room));
      console.log("A client disconnected");
    });
  });
});

const port = 8000;

server.listen(port, () => {
  console.log(`app runs on localhost:${port}`);
});
