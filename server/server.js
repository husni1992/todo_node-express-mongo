var express = require("express");
var bodyParser = require("body-parser");
const { ObjectID } = require("mongodb");

var { mongoose } = require("./db/mongoose");
var { Todo } = require("./models/todo");
var { User } = require("./models/user");

var app = express();
const port = process.env.PORT || 3000;

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
app.get("/todos/:id", (req, res) => {
   const id = req.params.id;

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

// DELETE /todos/:id
app.delete("/todos/:id", (req, res) => {
   const id = req.params.id;

   if (!ObjectID.isValid(id)) {
      return res.status(404).send();
   }

   Todo.findByIdAndRemove(id).then(
      todo => {
         if (!todo) {
            return res.status(404).send();
         }
         const response = {
            message: "Todo successfully deleted",
            id: todo._id
         };
         res.status(200).send(response);
      },
      err => {
         const response = {
            message: `Unable to delete todo with id ${todo._id}`
         };
         res.status(400).send(response);
      }
   );
});

// PUT /todos/:id
app.put("/todos/:id", (req, res) => {
   const id = req.params.id;
   Todo.findById(id).then(
      todo => {
         if (!todo) {
            return res.status(404).send();
         }
         todo.text = req.body.text || todo.text;
         todo.completed = req.body.completed || todo.completed;
         todo.completedAt = req.body.completedAt || todo.completedAt;
         // Save the updated document back to the database
         todo.save().then(
            doc => {
               const response = {
                  message: "Todo successfully updated",
                  todo
               };
               res.send(response);
            },
            err => {
               const response = {
                  message: `Unable to update todo with id ${id}`,
                  id: todo._id
               };
               res.status(400).send(response);
            }
         );
      },
      err => {
         const response = {
            message: `Unable to update todo with id ${id}`
         };
         res.status(404).send(response);
      }
   );
});

app.listen(port, () => {
   console.log(`Starting up at port ${port}`);
});

module.exports = { app };
