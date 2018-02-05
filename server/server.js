require("../config/config");

const _ = require("lodash");
const express = require("express");
const bodyParser = require("body-parser");
const { ObjectID } = require("mongodb");

var { mongoose } = require("./db/mongoose");
var { Todo } = require("./models/todo");
var { User } = require("./models/user");

var { authenticate } = require("./middleware/authenticate");

var app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

app.get("/todos", authenticate, (req, res) => {
   Todo.find({
      _creator: req.user._id
   }).then(
      todos => {
         res.send({ success: true, todos });
      },
      error => {
         res.status(400).send({ success: false, error });
      }
   );
});

app.post("/todos", authenticate, (req, res) => {
   var todo = new Todo({
      text: req.body.text,
      _creator: req.user._id
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

app.get("/todos/:id", authenticate, (req, res) => {
   const id = req.params.id;

   if (!ObjectID.isValid(id)) {
      return res.status(404).send();
   }

   Todo.findOne({
      _id: id,
      _creator: req.user._id
   })
      .then(todo => {
         if (!todo) {
            return res.status(404).send();
         }
         res.send({ todo });
      })
      .catch(error => res.status(400).send({ error }));
});

app.delete("/todos/:id", authenticate, (req, res) => {
   const id = req.params.id;

   if (!ObjectID.isValid(id)) {
      return res.status(404).send();
   }

   Todo.findOneAndRemove({
      _id: id,
      _creator: req.user._id
   }).then(
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

app.patch("/todos/:id", authenticate, (req, res) => {
   const id = req.params.id;
   var body = _.pick(req.body, ["text", "completed"]);

   if (!ObjectID.isValid(id)) {
      return res.status(404).send();
   }

   if (!_.isBoolean(body.completed)) {
      res.status(400).send();
   } else if (_.isBoolean(body.completed) && body.completed) {
      body.completedAt = new Date().getTime();
   } else {
      body.completed = false;
      body.completedAt = null;
   }

   Todo.findOneAndUpdate(
      {
         _id: id,
         _creator: req.user._id
      },
      {
         $set: body
      },
      {
         new: true
      }
   )
      .then(todo => {
         if (!todo) {
            return res.status(404).send();
         }

         res.send({ todo });
      })
      .catch(e => res.status(400).send());
});

// below is an alternate way to update todo with PUT
// app.put("/todos/:id", authenticate, (req, res) => {
//    const id = req.params.id;
//    Todo.findOne({
//       _id: id,
//       _creator: req.user._id
//    }).then(
//       todo => {
//          if (!todo) {
//             return res.status(404).send();
//          }
//          todo.text = req.body.text || todo.text;
//          todo.completed = req.body.completed || todo.completed;
//          todo.completedAt = req.body.completedAt || todo.completedAt;
//          // Save the updated document back to the database
//          todo.save().then(
//             doc => {
//                const response = {
//                   message: "Todo successfully updated",
//                   todo
//                };
//                res.send(response);
//             },
//             err => {
//                const response = {
//                   message: `Unable to update todo with id ${id}`,
//                   id: todo._id
//                };
//                res.status(400).send(response);
//             }
//          );
//       },
//       err => {
//          const response = {
//             message: `Unable to update todo with id ${id}`
//          };
//          res.status(404).send(response);
//       }
//    );
// });

app.post("/users", (req, res) => {
   var body = _.pick(req.body, ["email", "password"]);
   var user = new User(body);

   user
      .save()
      .then(() => {
         return user.generateAuthToken();
      })
      .then(token => {
         res
            .header("x-auth", token)
            .status(201)
            .send(user);
      })
      .catch(err => {
         res.status(400).send(err);
      });
});

app.post("/authenticate", (req, res) => {
   var body = _.pick(req.body, ["email", "password"]);

   User.findByCredentials(body.email, body.password)
      .then(user => {
         return user.generateAuthToken().then(token => {
            res.header("x-auth", token).send(user);
         });
      })
      .catch(err => {
         res.status(400).send();
      });
});

app.get("/users/me", authenticate, (req, res) => {
   res.send(req.user);
});

app.delete("/users/me/token", authenticate, (req, res) => {
   req.user
      .removeToken(req.token)
      .then(() => {
         res.status(200).send();
      })
      .catch(error => {
         res.status(400).send();
      });
});

app.listen(port, () => {
   console.log(`Starting up at port ${port}`);
});

module.exports = { app };
