const expect = require("expect");
const request = require("supertest");
const { ObjectID } = require("mongodb");
const jwt = require("jsonwebtoken");

const { app } = require("../server");
const { Todo } = require("../models/todo");
const { User } = require("../models/user");

const { todos, users, populateTodos, populateUsers } = require("./seed/seed");

beforeEach(populateUsers);
beforeEach(populateTodos);

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

describe("PATCH /todos/:id", () => {
   it("should update todo", done => {
      const completed = true;
      const text = "Build muscles now";

      request(app)
         .patch(`/todos/${todos[0]._id}`)
         .send({ completed, text })
         .expect(200)
         .expect(res => {
            expect(res.body.todo.text).toBe(text);
            expect(res.body.todo.completed).toBe(completed);
            expect(res.body.todo.completedAt).toBeA("number");
         })
         .end(done);
   });

   it("should clear completedAt when todo is not completed", done => {
      const completed = false;
      const text = "Build muscles now";

      request(app)
         .patch(`/todos/${todos[0]._id}`)
         .send({ completed, text })
         .expect(200)
         .expect(res => {
            expect(res.body.todo.text).toBe(text);
            expect(res.body.todo.completed).toBe(completed);
            expect(res.body.todo.completedAt).toNotExist();
         })
         .end(done);
   });
});

describe("GET /users/me", () => {
   it("should return user if authenticated", done => {
      var token = users[0].tokens[0].token;
      request(app)
         .get("/users/me")
         .set({ "x-auth": token })
         .expect(200)
         .expect(res => {
            expect(res.body.email).toBe(users[0].email);
            expect(res.body._id).toBe(users[0]._id.toHexString());
         })
         .end(done);
   });

   it("should return 401 if not authenticated", done => {
      request(app)
         .get("/users/me")
         .expect(401)
         .expect(res => {
            expect(res.body).toEqual({});
         })
         .end(done);
   });
});

describe("POST /users", () => {
   it("should create a user", done => {
      var [email, password] = ["mgha123aa@gmail.com", "passwordTest"];
      request(app)
         .post("/users")
         .send({ email, password })
         .expect(201)
         .expect(res => {
            expect(res.headers["x-auth"]).toExist();
            expect(res.body._id).toExist();
            expect(res.body.email).toBe(email);
         })
         .end(err => {
            if (err) {
               return done(err);
            }

            User.findOne({ email })
               .then(user => {
                  expect(user.email).toBe(email);
                  //    expect(user.password == password).toBe(false);
                  expect(user.password).toNotBe(password);
                  done();
               })
               .catch(err => done(err));
         });
   });

   it("should return validation error if request invalid (length of password is less than min)", done => {
      var [email, password] = ["mgha123aa@gmail.com", "aaa"];
      request(app)
         .post("/users")
         .send({ email, password })
         .expect(400)
         .expect(res => {
            expect(res.body.errors).toExist();
         })
         .end(done);
   });

   it("should not create user if email is already taken", done => {
      var [email, password] = [users[0].email, "sfdfbgfhgj$"];
      request(app)
         .post("/users")
         .send({ email, password })
         .expect(400)
         .expect(res => {
            expect(res.body.code).toBe(11000);
         })
         .end(done);
   });
});

describe("POST /authenticate", () => {
   it("should login user and return auth token", done => {
      request(app)
         .post("/authenticate")
         .send({
            email: users[0].email,
            password: users[0].password
         })
         .expect(200)
         .expect(res => {
            expect(res.headers["x-auth"]).toExist();
         })
         .end((err, res) => {
            if (err) {
               return done(err);
            }

            User.findById(users[0]._id)
               .then(user => {
                  expect(jwt.verify(res.headers["x-auth"], "xyzHusny")._id).toEqual(jwt.verify(users[0].tokens[0].token, "xyzHusny")._id);
                  done();
               })
               .catch(err => done(err));
         });
   });

   it("should reject invalid login", done => {
      request(app)
         .post("/authenticate")
         .send({
            email: users[1].email,
            password: users[1].password + "test"
         })
         .expect(400)
         .expect(res => {
            expect(res.headers["x-auth"]).toNotExist();
         })
         .end((err, res) => {
            if (err) {
               return done(err);
            }

            User.findById(users[1]._id)
               .then(user => {
                  expect(user.tokens.length).toBe(0);
                  done();
               })
               .catch(err => done(err));
         });
   });
});

describe("DELETE /users/me/token", () => {
   it("should remove auth token on logout", done => {
      request(app)
         .delete("/users/me/token")
         .set({ ["x-auth"]: users[0].tokens[0].token })
         .expect(200)
         .end((err, res) => {
            User.findById(users[0]._id)
               .then(user => {
                  console.log("length", users[0]._id, user.tokens[0]);
                  expect(user.tokens).toNotInclude(users[0].tokens[0].token);
                  done();
               })
               .catch(err => done(err));
         });
   });
});
