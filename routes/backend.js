//*Imports
require("dotenv/config")
const express = require("express")
const jwt = require("jsonwebtoken")
const uuid = require("uuid").v4
const User = require("../models/User")
const EmployerProfile = require("../models/EmployerProfile")
const nodemailer = require("nodemailer")
const config = require("../config")
const backend = express()
const sgm = require("@sendgrid/mail")
const otpgenerator = require("otp-generator")

//*--------------------MiddleWare--------------------//



//*---------------------Routes----------------------//

backend.get('/otp', async (req, res)=>{
    
    let otp = otpgenerator.generate(6, { upperCase: false, specialChars: false });
    let token;

   try {
    token = jwt.sign("login", otp, {
        expiresIn:"600"
    })

    (async (err, str) => {
        let mailOptions = {
          to: userInfo.email,
          from: {
            name: config.backend.name,
            email: config.backend.email,
          },
          subject: "JobsFinderPro OTP",
          html: `<p> The OTP is <b>${otp}</b> </p>`,
        }

        sgm.setApiKey(process.env.SEND_GRID_API)
        sgm
          .send(mailOptions)
          .catch((err) => { throw "error"; })
      })();
   } catch (error) {
       return res.json({
        error: true,
        message: "Something Went wrong, Could Not sign in at the moment",
        backError: err
       })
   }

   res.json({
    error: false,
    token : token
   })
   

})

backend.post('/login', (req, res)=>{

    let token = req.body.token
    let otp = req.body.otp

    let verifyToken = jwt.verify(token, otp)
})

module.exports = backend
