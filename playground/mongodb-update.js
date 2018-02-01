const { MongoClient, ObjectID } = require("mongodb");

const url = "mongodb://localhost:27017/TodoApp";

MongoClient.connect(url, (err, db) => {
  if (err) {
    return console.log("Unable to connect to MongoDB server");
  }
  console.log("Connected to MongoDB server");

  async function toggleCompletedStatus() {
    console.log("calling");
    var result = await db
      .collection("Todos")
      .find({ _id: new ObjectID("5a72a10131039eb656d653a1") })
      .toArray();

    findOneAndUpdate(result[0]);
  }

  //findOneAndUpdate , toggle completed state
  function findOneAndUpdate(item) {
    db
      .collection("Todos")
      .findOneAndUpdate(
        {
          _id: new ObjectID("5a72a10131039eb656d653a1")
        },
        {
          $set: { completed: !item.completed }
        },
        { returnOriginal: false }
      )
      .then(result => {
        console.log(result);
      });
  }

  toggleCompletedStatus();
  // db.close();
});
