const mongoose = require("mongoose");
const validator = require("validator");
const _ = require("lodash");
const jwt = require("jsonwebtoken");

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

var User = mongoose.model("User", UserSchema);

module.exports = { User };
