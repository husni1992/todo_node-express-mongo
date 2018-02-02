const expect = require("expect");
const request = require("supertest");
const { ObjectID } = require("mongodb");

const { app } = require("../server");
const { Todo } = require("../models/todo");

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

beforeEach(done => {
   Todo.remove({})
      .then(() => {
         return Todo.insertMany(todos);
      })
      .then(() => done());
});

describe("POST /todos", () => {
   it("should create a new todo", done => {
      var text = "Test todo text";

      request(app)
         .post("/todos")
         .send({ text })
         .expect(200)
         .expect(res => {
            expect(res.body.text).toBe(text);
         })
         .end((err, res) => {
            if (err) {
               return done(err);
            }
            Todo.find({ text })
               .then(todos => {
                  expect(todos.length).toBe(1);
                  expect(todos[0].text).toBe(text);
                  done();
               })
               .catch(e => {
                  done(e);
               });
         });
   });

   it("should not create todo with invalid body data", done => {
      var text = "Test todo text";
      request(app)
         .post("/todos")
         .send()
         .expect(400)
         .expect(res => {
            expect(res.body.success).toBe(false);
         })
         .end((err, res) => {
            if (err) {
               return done(err);
            }
            Todo.find()
               .then(todos => {
                  expect(todos.length).toBe(2);
                  done();
               })
               .catch(e => {
                  done(e);
               });
         });
   });
});

describe("GET /todos", () => {
   it("should get all todos", done => {
      request(app)
         .get("/todos")
         .expect(200)
         .expect(res => {
            expect(res.body.todos.length).toBe(2);
         })
         .end(done);
   });
});

describe("GET /todos/:id", () => {
   it("should return todo doc", done => {
      request(app)
         .get(`/todos/${todos[0]._id.toHexString()}`)
         .expect(200)
         .expect(res => {
            expect(res.body.todo.text).toBe(todos[0].text);
         })
         .end(done);
   });

   it("should return 404 if todo not found", done => {
      const hexId = new ObjectID().toHexString();
      request(app)
         .get(`/todos/${hexId}`)
         .expect(404)
         .end(done);
   });

   it("should return 404 if non-object ids", done => {
      const hexId = new ObjectID().toHexString();
      request(app)
         .get(`/todos/1245`)
         .expect(404)
         .end(done);
   });
});

describe("DELETE /todos/:id", () => {
   it("should return todo id when deleted", done => {
      request(app)
         .delete(`/todos/${todos[0]._id}`)
         .expect(200)
         .expect(res => {
            console.log(res.body);
            expect(res.body.id).toEqual(todos[0]._id);
            expect(res.body.message).toEqual("Todo successfully deleted");
         })
         .end((err, res) => {
            if (err) {
               return done(err);
            }

            Todo.findById(todos[0]._id.toHexString())
               .then(todo => {
                  expect(todo).toNotExist();
                  done();
               })
               .catch(e => done(e));
               
            // request(app)
            //    .get(`/todos/${todos[0]._id}`)
            //    .expect(404)
            //    .end(done);
         });
   });

   it("should return 404 if todo not found", done => {
      const hexId = new ObjectID().toHexString();
      request(app)
         .delete(`/todos/${hexId}`)
         .expect(404)
         .end(done);
   });

   it("should return 404 if non-object ids", done => {
      const hexId = new ObjectID().toHexString();
      request(app)
         .delete(`/todos/1245`)
         .expect(404)
         .end(done);
   });
});
