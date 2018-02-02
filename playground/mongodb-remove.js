const { ObjectID } = require("mongodb");

const { mongoose } = require("../server/db/mongoose");
const { Todo } = require("../server/models/todo");
const { User } = require("../server/models/user");

// Multiple remove: Todo.remove({}) , empty object will remove everything, put parameter , it will remove those
// Todo.remove({ completed: false }).then(result => {
//    console.log(result.result);
// });

// Todo.findOneAndRemove
// Todo.findByIdAndRemove

Todo.findOneAndRemove({ _id: "5a73ffc59d1ddc0c26898c72" }).then(
   doc => {
      console.log("Removed", doc);
   },
   error => {}
);
