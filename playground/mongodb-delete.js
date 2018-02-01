const { MongoClient, ObjectID } = require('mongodb');

const url = 'mongodb://localhost:27017/TodoApp';
const dbName = 'test';

MongoClient.connect(url, (err, db) => {
    if (err) {
        return console.log('Unable to connect to MongoDB server')
    }
    console.log('Connected to MongoDB server');

    //deleteMany
    // db.collection('Todos').deleteMany({text: 'Master React'}).then((result)=>{
    //     console.log(result);
    // });

    //deleteOne
    // db.collection('Todos').deleteOne({ text: 'Get Haircut' }).then((result) => {
    //     console.log(result.result);
    // });


    //findOneAndDelete
    // db.collection('Todos').findOneAndDelete({ text: 'Do boxing' }).then((result) => {
    //     console.log('Deleted', result.value);

    //     db.collection('Todos').insertOne(result.value, (err, result) => {
    //         if (err) {
    //             return console.log('Unable to insert todo', err)
    //         }
    //         // console.log(JSON.stringify(result.ops, undefined, 2));
    //         console.log('Insert success', result.ops[0]._id.getTimestamp());
    //     })
    // });

    // db.collection('User').deleteMany({ name: 'Husny' }).then((result) => {
    //     console.log(result);
    // });

    db.collection('User').findOneAndDelete({ _id: new ObjectID('5a72a4c331039eb656d65513') }).then(result => {
        console.log(result)
    })

    // db.close();
});