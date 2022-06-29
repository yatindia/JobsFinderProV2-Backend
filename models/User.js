const mongoose = require("mongoose")

const UserSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },

  type: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
  },

  password: {
    type: String,
    required: true,
  },

  profileImage: {
    type: String,
    required: true,
  },

  rememberToken: {
    type: String,
    required: true,
  },

  accountConfirmed: {
    type: Boolean,
    default: false,
  },

  dateOfSignup: {
    type: Date,
    default: Date.now(),
  },
})
module.exports = mongoose.model("User", UserSchema)
