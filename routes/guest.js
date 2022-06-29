//*Imports
require("dotenv/config")
const express = require("express")
const EmployerProfile = require("../models/EmployerProfile")
const Job = require("../models/Job")
const guest = express()
guest.set("view engine", "ejs")

guest.post("/searchone", async (req, res) => {

    try {
      let checkJobs = await Job.findOne({
        _id: req.body.jobid
      }) || false
  
      let checkOrg = await EmployerProfile.findOne({
        link_id: checkJobs.link_id
      }) || false
  
      if (checkJobs != false && checkOrg != false) {
  
        return res.json({
          error: false,
          message: "Success",
          data: {
            job: checkJobs,
            org: checkOrg
          }
        })
  
      } else {
        return res.json({
          error: true,
          message: "Please check the Job Id parameter"
        })
      }
  
    } catch (error) {
      return res.json({
        error: true,
        message: "Somthing went wrong, please check the payload",
        data: [],
        backError: error
      })
    }
  
  })

  
guest.get("/view/:jobid", async (req, res) => {

    try {
      let checkJobs = await Job.findOne({
        _id: req.params.jobid
      }) || false
  
      let checkOrg = await EmployerProfile.findOne({
        link_id: checkJobs.link_id
      }) || false
  
      if (checkJobs != false && checkOrg != false) {
        console.log(checkJobs);
        console.log(checkOrg);

        return res.render("jobsView", {
          data: {
            job: checkJobs,
            org: checkOrg
          }
        })
        
  
      } else {
        return res.send("Please check the Job Id parameter")
      }
  
    } catch (error) {
      return res.send("Somthing went wrong, please check the payload")
    }
  
  })
  
  module.exports = guest