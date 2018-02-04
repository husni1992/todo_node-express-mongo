const { ObjectID } = require("mongodb");
const jwt = require("jsonwebtoken");

const { Todo } = require("../../models/todo");
const { User } = require("../../models/user");

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const users = [
   {
      _id: userOneId,
      email: "hisny@hmail.om",
      password: "userOnePassword",
      tokens: [
         {
            access: "auth",
            token: jwt.sign({ _id: userOneId, access: "auth" }, "xyzHusny").toString()
         }
      ]
   },
   {
      _id: userTwoId,
      email: "mghahamed@hmail.om",
      password: "userTwoPassword"
   }
];

const todos = [
   {
      _id: new ObjectID(),
      text: "First task to do"
   },
   {
      _id: new ObjectID(),
      text: "Second test to do"
   }
];

populateUsers = done => {
   User.remove({})
      .then(() => {
         var userOne = new User(users[0]).save();
         var userTwo = new User(users[1]).save();

         return Promise.all([userOne, userTwo]);
      })
      .then(() => {
         done();
      });
};

const populateTodos = done => {
   Todo.remove({})
      .then(() => {
         return Todo.insertMany(todos);
      })
      .then(() => done());
};

module.exports = { todos, users, populateTodos, populateUsers };
