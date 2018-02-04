const bcrypt = require("bcryptjs");

authenticateUser = function(password, hashedPassword, callback) {
   bcrypt.compare(password, hashedPassword, callback);
};

module.exports = { authenticateUser };
