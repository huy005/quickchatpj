let userList = [
  {
    id: "1",
    username: "watanabe",
    room: "room01",
  },

  {
    id: "2",
    username: "Ohara",
    room: "room01",
  },

  {
    id: "3",
    username: "Ueno",
    room: "room01",
  },

  {
    id: "4",
    username: "takahashi",
    room: "room02",
  },

  {
    id: "5",
    username: "iida",
    room: "room03",
  },
];

const addUser = (newUser) => userList.push(newUser);
const getUserList = (room) => userList.filter((user) => user.room === room);
const removeUser = (id) =>
  (userList = userList.filter((user) => user.id !== id));
const findUser = (id) => userList.find((user) => user.id === id);

module.exports = {
  getUserList,
  addUser,
  removeUser,
  findUser,
};
