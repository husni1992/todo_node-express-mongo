var express = require("express");
var bodyParser = require("body-parser");
const { ObjectID } = require("mongodb");

var { mongoose } = require("./db/mongoose");
var { Todo } = require("./models/todo");
var { User } = require("./models/user");

var app = express();
app.use(bodyParser.json());

app.get("/todos", (req, res) => {
   Todo.find().then(
      todos => {
         res.send({ success: true, todos });
      },
      error => {
         res.status(400).send({ success: false, error });
      }
   );
});

// GET /todos
app.post("/todos", (req, res) => {
   console.log(req.body);
   var todo = new Todo({
      text: req.body.text
   });

   todo.save().then(
      doc => {
         res.send(doc);
      },
      err => {
         res.status(400).send({ success: false, error: err });
      }
   );
});

// GET /todos/2445323
app.get("/todos/:todoId", (req, res) => {
   const id = req.params.todoId;

   if (!ObjectID.isValid(id)) {
      return res.status(404).send();
   }

   Todo.findById(id)
      .then(todo => {
         if (!todo) {
            return res.status(404).send();
         }
         res.send({ todo });
      })
      .catch(error => res.status(400).send({ error }));
});

app.listen(3000, () => {
   console.log("Starting on port 3000");
});

module.exports = { app };
