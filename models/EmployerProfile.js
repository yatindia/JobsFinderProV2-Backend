const mongoose = require("mongoose")

const EmployerProfileSchema = mongoose.Schema({

  link_id: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },

  orgLogo: {
    type: String,
    required: true,
  },

  orgName: {
    type: String,
    required: true,
  },
  orgEmail: {
    type: String,
    required: true,
  },
  orgPhone: {
    type: String,
    required: true,
  },
  orgAddress: {
    type: String,
    required: true,
  },
  orgWebsite: {
    type: String,
    required: true,
  },
  orgCountry: {
    type: String,
    required: true,
  },
  pan: {
    type: String,
    required: true,
  },
  gstin: {
    type: String,
    required: true,
  },
  resumePoints: {
    type: Number,
    default: 25,
    required: true,
  },

  downloadedResumes: [{
    type: String
  }],

  dateOfSignup: {
    type: Date,
    default: Date.now(),
  },
})
module.exports = mongoose.model("EmployerProfile", EmployerProfileSchema)
