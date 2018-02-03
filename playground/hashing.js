const { SHA256 } = require("crypto-js");
const jwt = require("jsonwebtoken");

var data = {
   id: 18
};

var token = jwt.sign(data, "xyz7899");
console.log(token);

var decoded;

try {
   decoded = jwt.verify(token, "xyz7899x");
} catch (err) {
   return console.log("**********Error*************");
}

console.log("Decoded", decoded);

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
