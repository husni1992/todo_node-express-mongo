const { ObjectID } = require("mongodb");

const { mongoose } = require("../server/db/mongoose");
const { Todo } = require("../server/models/todo");
const { User } = require("../server/models/user");

// var id = "5a731c88c1c0b83030d51f3211";

// if (!ObjectID.isValid(id)) {
//    console.log("Id not valid");
// }

// Todo.find({
//    _id: id
// }).then(todos => {
//    console.log("Todos", todos);
// });

// // to find single document by any parameter other than _id
// Todo.findOne({
//    _id: id
// }).then(todo => {
//    console.log("Todo", todo);
// });

// to find by _id and nothing else
// Todo.findById(id)
//    .then(todo => {
//       if (!todo) {
//          return console.log("Id not found");
//       }
//       console.log("Todo by id", todo);
//    })
//    .catch(e => {
//       console.log(e);
//    });

// var user = new User({
//    firstName: "Afnan",
//    email: "afitofi@gmail.com"
// });

// user.save().then(doc => {
//    console.log("Created user", doc);
// });

// User.findById("5a733392d16b26702e1aa118").then(
//    user => {
//       console.log("User found", user);
//    },
//    error => {
//       console.log(error);
//    }
// );

User.findById("5a733372a23a3da821f58c2b")
   .then(user => {
      if (!user) {
         return console.log("Id not found");
      }
      console.log("User found", user);
   })
   .catch(err => console.log(err));
