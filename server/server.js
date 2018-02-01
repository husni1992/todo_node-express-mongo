var express = require("express");
var bodyParser = require("body-parser");

var { mongoose } = require("./db/mongoose");
var { Todo } = require("./models/todo");
var { User } = require("./models/user");

var app = express();
app.use(bodyParser.json());

app
   .post("/todos", (req, res) => {
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
   })

   .get("/todos", (req, res) => {
      Todo.find(
         {},
         (err, todos) => {
            res.send({ success: true, data: todos });
         },
         err => {
            res.status(400).send({ success: false, error: err });
         }
      );
   });

app.listen(3000, () => {
   console.log("Starting on port 3000");
});

module.exports = { app };
