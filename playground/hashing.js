const { SHA256 } = require("crypto-js");
const jwt = require("jsonwebtoken");
const { ObjectID } = require("mongodb");

const bcrypt = require("bcryptjs");

var password = "pass@123";

// bcrypt.genSalt(10, (err, salt) => {
//    bcrypt.hash(password, salt, (err, hash) => {
//       console.log(hash);
//    });
// });

// var hashedPassword = "$2a$10$1Cq2olHh7wzUFq0VNc3Be.UWPspnYKZKhyBvAPAR0SDU/zoxNEu7m";

// bcrypt.compare(password, hashedPassword, (err, res) => {
//    console.log(res);
// });

var data = {
   id: 18
};

const userOneId = new ObjectID().toHexString();

/*
jwt.sign('abc) will not be same if done in 2 different times
*/

var token1 = jwt.sign("5a76eb5512c64e24f4e849a5", "xyzHusny");
var token2 = jwt.sign("5a76eb5512c64e24f4e849a5", "xyzHusny");
// console.log(token1 === token2);

var tok1 = jwt.sign({ _id: "5a76eb5512c64e24f4e849a5" }, "xyzHusny");

setTimeout(function() {
   var tok2 = jwt.sign({ _id: "5a76eb5512c64e24f4e849a5" }, "xyzHusny");
   console.log("Fuck 1: ", tok1);
   console.log("Fuck 2: ", tok2);
   console.log(tok1 === tok2);

   console.log(jwt.verify(token1, "xyzHusny")._id === jwt.verify(token2, "xyzHusny")._id);
}, 1000);
// var decoded;

// try {
//    decoded = jwt.verify(token, "xyz7899x");
// } catch (err) {
//    return console.log("**********Error*************");
// }

// console.log("Decoded", decoded);

// const message = "I am user number 3";
// const hash = SHA256(message).toString();

// console.log(`Message: ${message}`)
// console.log(`Hash: ${hash}`)

// const jwt = require("jsonwebtoken");

// var data = {
//    name: "Husny"
// };

// var token = jwt.sign(data, "secret1");
// console.log(token);

// var msg = "I'm user number 3";
// var hash = SHA256(msg).toString();

// console.log("Message", msg);
// console.log("Hash", hash);

// var data = {
//    id: 4
// };

// var token = {
//    data,
//    hash: SHA256(JSON.stringify(data) + "somesecret").toString()
// };

// token.data.id = 5;
// token.hash = SHA256(JSON.stringify(token.data)).toString();

// var resultHarsh = SHA256(JSON.stringify(token.data) + 'somesecret').toString();

// if (resultHarsh === token.hash) {
//    console.log("Data was not changed");
// } else {
//    console.log("Data changed, do not trust");
// }
