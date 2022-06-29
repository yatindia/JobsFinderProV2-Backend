const mongoose = require("mongoose")

const UserProfileSchema = mongoose.Schema({
  
  dateOfBirth: {
    type: Date,
    required: true,
  },

  link_id: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
  },

  jobTitle: {
    type: String,
    required: true,
  },

  gender: {
    type: String,
    required: true,
  },
  mobile: {
    type: Number,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  appliedFor: [{
    type: String
  }],

  pastJobs: [{
    type: String,
    required: true,
  }],

  qualifications: [{
    type: Object,
    required: true,
  }],
  techQualifications: [{
    type: Object,
    required: true,
  }],

  accountConfirmed: {
    type: Boolean,
    default: false,
  },

  resume: {
    type: String,
    required: true,
  },

  dateOfSignup: {
    type: Date,
    default: Date.now(),
  },
})
module.exports = mongoose.model("Userprofile", UserProfileSchema)