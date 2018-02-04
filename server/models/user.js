const mongoose = require("mongoose");
const validator = require("validator");
const _ = require("lodash");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

var UserSchema = new mongoose.Schema({
   email: {
      type: String,
      required: true,
      minlength: 1,
      trim: true,
      unique: true,
      validate: {
         validator: value => validator.isEmail(value)
      }
   },
   password: {
      type: String,
      required: true,
      minlength: 6
   },
   tokens: [
      {
         access: {
            type: String,
            required: true
         },
         token: {
            type: String,
            required: true
         }
      }
   ]
});

// send only the _id and email with the response to any request on user model
UserSchema.methods.toJSON = function() {
   return _.pick(this, ["_id", "email"]);
};

UserSchema.methods.generateAuthToken = function() {
   var user = this;
   var access = "auth";
   var token = jwt
      .sign(
         {
            _id: user._id.toHexString(),
            access
         },
         "xyzHusny"
      )
      .toString();

   user.tokens.push({
      access,
      token
   });

   return user.save().then(() => {
      return token;
   });
};

UserSchema.pre("save", function(next) {
   var user = this;
   if (user.isModified("password")) {
      bcrypt.genSalt(10, (err, salt) => {
         bcrypt.hash(user.password, salt, (err, hash) => {
            user.password = hash;
            next();
         });
      });
   } else {
      next();
   }
});

UserSchema.statics.findByToken = function(token) {
   const user = this;
   var decode;

   try {
      decode = jwt.verify(token, "xyzHusny");
   } catch (err) {
      return Promise.reject("Unverified access code");
   }

   return user.findOne({
      _id: decode._id,
      "tokens.token": token,
      "tokens.access": "auth"
   });
};

UserSchema.statics.findByCredentials = function(email, password) {
   const user = this;

   return user
      .findOne({
         email
      })
      .then(user => user)
      .then(user => {
         if (!user) {
            return Promise.reject("User not found");
         }
         return new Promise((resolve, reject) => {
            bcrypt.compare(password, user.password, function(err, res) {
               if (res === false) {
                  reject("Unauthorized");
               }
               resolve(user);
            });
         });
      });
};

var User = mongoose.model("User", UserSchema);

module.exports = { User };
