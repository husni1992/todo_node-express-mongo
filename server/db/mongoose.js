var mongoose = require("mongoose");

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI);

// online db path "mongodb://rihan_xyz:Abcd1234@ds123258.mlab.com:23258/todo_db"

module.exports = { mongoose };
