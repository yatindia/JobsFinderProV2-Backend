const mongoose = require("mongoose")

const JobSchema = mongoose.Schema({

  link_id: {
    type: String,
    required: true,
  },

  jobTitle: {
    type: String,
    required: true,
  },

  jobDescription: {
    type: String,
    required: true,
  },

  jobCity: {
    type: String,
    required: true,
  },

  jobSalary: {
    type: String,
    required: true,
  },

  jobRequirement: {
    type: String,
    required: true,
  },

  jobType: {
    type: String,
    required: true,
  },
  jobCategory: {
    type: String,
    required: true,
  },

  jobSubCategory: {
    type: String,
    required: true,
  },

  jobApplyEnd: {
    type: String,
    required: true,
  },

  appliedBy: [{
    type: String
  }],

  dateOfAdd: {
    type: Date,
    default: Date.now(),
  },
})
module.exports = mongoose.model("Job", JobSchema)
