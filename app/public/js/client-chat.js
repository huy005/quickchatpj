// Request server to conect to client
const socket = io();

//  Sending messages with bad words prevention
document.getElementById("chatRoom_form").addEventListener("submit", (e) => {
  e.preventDefault();

  const messageText = document.getElementById(
    "chatRoom_form_inputMessage"
  ).value;

  const acknowledgements = (errors) => {
    if (errors) {
      return alert("メッセージが無効だ。");
    }
    console.log("メッセージが送信された。");
  };
  socket.emit("send messages c2s", messageText, acknowledgements);
});

// Getting messages from server and then showing on chat room
socket.on("send messages s2c", (messages) => {
  const { messageText, username, createdAt } = messages;
  const contentHtml = document.getElementById(
    "rightChatRoom_content"
  ).innerHTML;
  const messageContent = `
              <div class="rightChatRoom_content_messageItem">
                <div class="rightChatRoom_content_messageRow1">
                  <p>${username}</p>
                  <p>${createdAt}</p>
                </div>
                <div class="rightChatRoom_content_messageRow2">
                  <p>${messageText}</p>
                </div>
              </div>       
  `;
  let chatRoomContentInnerHtml = contentHtml + messageContent;
  document.getElementById("rightChatRoom_content").innerHTML =
    chatRoomContentInnerHtml;

  // Clear message input
  document.getElementById("chatRoom_form_inputMessage").value = "";
});

//  Sharing location
document
  .getElementById("chatRoom_shareLocationBtn")
  .addEventListener("click", () => {
    if (!navigator.geolocation) {
      return alert("This browser is supported with sharing location.");
    }

    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      socket.emit("share location c2s", latitude, longitude);
    });
  });

// Redering shared location
socket.on("share location s2c", (messages) => {
  const { messageText, username, createdAt } = messages;
  const contentHtml = document.getElementById(
    "rightChatRoom_content"
  ).innerHTML;
  const messageContent = `
  <div class="rightChatRoom_content_messageItem">
                <div class="rightChatRoom_content_messageRow1">
                  <p>${username}</p>
                  <p>${createdAt}</p>
                </div>
                <div class="rightChatRoom_content_messageRow2">
                  <a href=${messageText} target="_blank">${username}の場所を見よう！！！</a>
                </div>
              </div> 
    <div>     
    `;
  const chatRoom_Location = contentHtml + messageContent;
  document.getElementById("rightChatRoom_content").innerHTML =
    chatRoom_Location;
});

// Get parameters from url
const params = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const { username, room } = params;

// Deviding rooms
socket.emit("join room c2s", { username, room });

// Rendering Room
document.getElementById("leftChatRoom_roomName").innerHTML = room;

// Getting user list
socket.on("send user list s2c", (userList) => {
  console.log("User List:", userList);
  let contentHtml = "";
  userList.map((user, index) => {
    contentHtml += `
    <li style="color: #2c7ed6;" key=${index}>${user.username}</li>
    `;
    document.getElementById("leftChatRoom_userList").innerHTML = contentHtml;
  });
});
