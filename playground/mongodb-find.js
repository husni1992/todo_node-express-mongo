const { MongoClient, ObjectID } = require('mongodb');

const url = 'mongodb://localhost:27017/TodoApp';
const dbName = 'test';

MongoClient.connect(url, (err, db) => {
    if (err) {
        return console.log('Unable to connect to MongoDB server')
    }
    console.log('Connected to MongoDB server');

    // db.collection('Todos').find({
    //     _id: new ObjectID('5a720ac6efd7701750412020')
    // }).toArray().then((docs) => {
    //     console.log('Todos');
    //     console.log(JSON.stringify(docs), undefined, 2);
    // }, (err) => {
    //     console.log('Unable to fetch todos', err)
    // })

    // db.collection('Todos').find().count().then((count) => {
    //     console.log(`Todos count: ${count}`);
    // }, (err) => {
    //     console.log('Unable to fetch todos', err)
    // })

    // console.log(db.collection('User').find({ name: 'Husny' }))

    db.collection('User').find({name: 'Husny'}).toArray().then((doc) => {
        console.log(`Todos`);
        console.log(doc);
    }, (err) => {
        console.log('Unable to fetch todos', err)
    })

    db.close();
});