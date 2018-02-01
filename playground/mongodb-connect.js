// const MongoClient = require('mongodb').MongoClient;
const { MongoClient, ObjectID } = require('mongodb');

var obj = new ObjectID()
console.log(obj);

// Connection url
const url = 'mongodb://localhost:27017/TodoApp';
// Database Name
const dbName = 'test';

MongoClient.connect(url, (err, db) => {
    if (err) {
        return console.log('Unable to connect to MongoDB server')
    }
    console.log('Connected to MongoDB server');

    // db.collection('Todos').insertOne({
    //     text: 'Something todo',
    //     completed: false
    // }, (err, result) => {
    //     if (err) {
    //         return console.log('Unable to insert todo', err)
    //     }
    //     console.log(JSON.stringify(result.ops, undefined, 2));
    // })

    db.collection('User').insertOne({
        name: 'Husny Ahamed',
        age: 25,
        address: '9B 25L'
    }, (err, result) => {
        if (err) {
            return console.log('Unable to insert User', err)
        }
        // console.log(JSON.stringify(result.ops, undefined, 2));
        console.log(result.ops[0]._id.getTimestamp());
    })

    db.close();
});