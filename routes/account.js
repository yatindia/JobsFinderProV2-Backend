//*Imports
require("dotenv/config")
const express = require("express")
const multer = require("multer")
const uuid = require("uuid").v4
const jwt = require("jsonwebtoken")
const User = require("../models/User")
const UserProfile = require("../models/UserProfile")
const EmployerProfile = require("../models/EmployerProfile")
const nodemailer = require("nodemailer")
const ejs = require("ejs")
const config = require("../config")
const account = express()
const sgm = require("@sendgrid/mail")
const {
  checkEmpty
} = require("../functions");

//*--------------------MiddleWare--------------------//
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, config.profileDirectory)
  },
  filename: (req, file, cb) => {
    const {
      originalname
    } = file

    let finalName = () => {
      // let ext = originalname.split(".")
      return `${uuid()}.jpg`
    }

    let file_name = finalName()
    req.body.customFileUploadName = file_name

    cb(null, file_name)
  },
})

const storageResume = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, config.resumeDirectory)
  },
  filename: (req, file, cb) => {
    const {
      originalname
    } = file

    let finalName = () => {
      let ext = originalname.split(".")
      return `${uuid()}.${ext[ext.length - 1]}`
    }

    let file_name = finalName()
    req.body.customResumeUploadName = file_name

    cb(null, file_name)
  },
})
const upload = multer({ storage: storage })
const uploadResume = multer({ storage: storageResume })


//*--------------------Routes--------------------//
account.post("/uploaddp", upload.single("profile"), (req, res) => {
  let value = req.body.customFileUploadName

  try {
    if (value) {
      res.json({
        uploadStatus: true,
        message: "File Uploaded Successfully",
        fileName: value,
      })
    } else {
      res.json({
        uploadStatus: false,
        message: "File Uploaded Failed",
        fileName: "",
      })
    }
  } catch (error) {
    res.json({
      error,
    })
  }
})

account.post("/uploadresume", uploadResume.single("resume"), (req, res) => {
  let value = req.body.customResumeUploadName

  try {
    if (value) {
      //* S-Response
      res.json({
        uploadStatus: true,
        message: "File Uploaded Successfully",
        fileName: value,

      })
    } else {
      //* E-Response
      res.json({
        uploadStatus: false,
        message: "File Uploaded Failed",
        fileName: "",

      })
    }

  } catch (error) {
    res.json({
      error,
    })
  }
})

//*-------------------------SIGNUP-------------------------//
account.post("/signup", async (req, res) => {
  const emailCheck = (await User.findOne({
    email: req.body.email
  })) || false

  //*If email Already Exists
  if (emailCheck !== false) {
    return res.json({
      error: `The email Already Exists`,
      status: false,
    })
  }
  //*If email Already Exists but not confirmed
  else if (emailCheck.accountConfirmed == false) {
    return res.json({
      error: `Please Confirm The Mail`,
      status: false,
    })
  } else {

    let userInfo = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      type: req.body.type,
      email: req.body.email,
      password: req.body.password,
      profileImage: req.body.profileImage,
    }

    //* Check For Empty Field
    let errorCheck = await checkEmpty(userInfo);


    if (errorCheck.error == false) {

      //* If No empty field
      let createUser = User(userInfo)

      let token = jwt.sign({
        verify: "true",
        email: req.body.email
      },
        process.env.JWT_HASH_KEY, {
        expiresIn: "1h",
      }
      )

      try {
        createUser
          .save()
          .then(async (result) => {

            (async (err, str) => {
              let mailOptions = {
                to: userInfo.email,
                from: {
                  name: "Jobs Finder Pro",
                  email: "server@jobsfinderpro.com",
                },
                subject: "Jobs Finder Pro",
                html: `<h1>Please Confirm your account</h1> <br> <a target='_blank' href='${config.domain}/account/confirm/${token}'>Click to Confirm account</a>`,
              }

              sgm.setApiKey(process.env.SEND_GRID_API)
              sgm
                .send(mailOptions)
                .then((rs) => "")
                .catch((err) => { throw "error"; })
            })();

            return res.json({
              error: false,
              message: `Verification Email Is sent. Please Check Your Mail Id`,
            })
          })
          .catch((err) => {
            return res.json({
              error: true,
              message: "Something Went wrong, Could Not signup at the moment",
              backError: err
            })

          })
      } catch (error) {
        console.log(error);
        console.log("error");
        return res.json({
          error: true,
          message: "Something Went wrong, Could Not signup at the moment",
          backError: error
        })
      }


    } else {
      //* If empty field found
      res.json({
        error: true,
        message: "Some fields are found to be empty",
        backError: errorCheck.message
      })
    }
  }
})

//*--------------------CONFIRM SIGNUP--------------------//
account.get("/confirm/:id", (req, res) => {
  let decode = jwt.verify(
    req.params.id,
    process.env.JWT_HASH_KEY,
    (option, success) => {
      if (option) {

        return res.send(`401 ERR__VERIFICATION_TOKEN_EXPIRED. <a href="${config.frontEnd}">Try Again</a>`)

      } else {
        User.updateOne({
          email: success.email
        }, {
          $set: {
            accountConfirmed: true
          }
        }).then((re) => {
          if (re !== null) {
            return res.send(`Email Verified Successfully, Got to <a href="${config.frontEnd}">Login</a> `)
          }
        }).catch(error => {
          return res.send(`Somthing went wrong, please try again later`)
        })

        res.send(`Email Verified Successfully, Got to <a href="${config.frontEnd}">Login</a> `)
      }
    }
  )
})

//*--------------------REAPPLY FOR SIGNUP VERFICATION--------------------//
account.post("/reconfirm", async (req, res) => {
 
  //Checks weather the email is in DB
  const emailCheck = await User.findOne({email: req.body.email}) || false
 

  if (emailCheck.email == req.body.email && emailCheck.accountConfirmed == true) {
    return res.json({
      error: true,
      message: `This email Already Exists and confirmed`,
    })
  } else if (
    emailCheck.accountConfirmed == false &&
    emailCheck.email == req.body.email
  ) {
    let token = jwt.sign({
      verify: "true",
      email: emailCheck.email
    },
      process.env.JWT_HASH_KEY, {
      expiresIn: "4h",
    }
    )


    try {
      (async (err, str) => {
        let mailOptions = {
          to: emailCheck.email,
          from: {
            name: "Jobs Finder Pro",
            email: "server@jobsfinderpro.com",
          },
          subject: `Email Confirmation ${config.siteName}`,
          html: `<b><a href="${config.domain}/account/confirm/${token}">Confirm Your Mail <br> ${config.domain}/account/confirm/${token}</a></b>`,
        }

        sgm.setApiKey(process.env.SEND_GRID_API)
        sgm
          .send(mailOptions)
          .then((rs) => console.log("mail send"))
          .catch((err) => { throw "error"; })
      })();
    } catch (error) {
      return res.json({
        error: true,
        message: "Something Went wrong, Could Not send mail at the moment",
        backError: error,
      })
    }

    return res.json({
      error: false,
      message: `Verification Email Is sent. Please Check Your Mail Id. The Email will be only valid for 4 hours`,
    })


  }

  res.json({
    error: true,
    message: "Something Went wrong, Could Not send mail at the moment"
    
  })
})

//*--------------------LOGIN--------------------//
account.post("/login", async (req, res) => {

  const emailCheck = (await User.findOne({ email: req.body.email })) || false

  if (!emailCheck) {
    res.json({
      error: true,
      message: `Wrong Credentials`
    })
  } else if (!emailCheck.accountConfirmed) {
    res.json({
      error: true,
      message: `Please confirm your verification e-mail`,
    })
  } else if(emailCheck.password != req.body.password){

    res.json({
      error: true,
      message: `user information missmatch`,
    })

  } else {
    try {
      let token = jwt.sign({
        email: req.body.email,
        type: emailCheck.type,
        authid: emailCheck._id
      },
        process.env.JWT_HASH_KEY, {
        expiresIn: "2d"
      })


      //* S-Response
      res.json({
        error: false,
        message: `login Success`,
        data: {
          authToken: token,
          type: emailCheck.type,
          firstName: emailCheck.firstName,
          lastName: emailCheck.lastName,
          authid: emailCheck._id
        }
      })
    } catch (error) {
      //* E-Response
      res.json({
        error: true,
        message: "Could initiate login request at the moment",
        backError: error
      })
    }
  }
})

//*--------------------RECOVER PASSWORD--------------------//

account.post("/recoverPassword", async (req, res) => {

  const emailCheck = (await User.findOne({email: req.body.email})) || false

  if (emailCheck == false) {
    return res.json({
      error: true,
        message: "Something Went wrong, Could Not send mail at the moment",
    })
  }


  if (emailCheck.email == req.body.email && emailCheck != false) {

    try {
      (async (err, str) => {
        let mailOptions = {
          to: emailCheck.email,
          from: {
            name: "Jobs Finder Pro",
            email: "server@jobsfinderpro.com",
          },
          subject: "Your Password",
          html: `Your Password is :${emailCheck.password}`,
        }

        sgm.setApiKey(process.env.SEND_GRID_API)
        sgm
          .send(mailOptions)
          .then((rs) => "")
          .catch((err) => { throw "error"; })
      })();
    } catch (error) {
      return res.json({
        error: true,
        message: "Could initiate password recover request at the moment, please check the credentials",
        backError: err,
      })
    }
    //* S-Response
    res.json({
      error: false,
      message: `Your Password is sent to your registered e-mail id`,
    })
  }
})

//*--------------------SIGN UP PART 2--------------------//
account.post("/signupcomplete", async (req, res) => {

  let userCheck = await User.findOne({ email: req.body.email }) || false;
  let userCheck2 = await UserProfile.findOne({ email: req.body.email }) || false;
  let userCheck3 = await EmployerProfile.findOne({ email: req.body.email }) || false;

  if (userCheck === null) {
    return res.json({
      error: true,
      message: "An account with this email does not exist"
    })
  }

  if (userCheck.type == "seeker" && req.body.type == "seeker") {

    if (userCheck2.email == userCheck.email) {
      return res.json({
        error: false,
        message: "Profile Part 2 Aready Updated Successfully",
      })
    }
    let authId = userCheck._id.toString()

    let seekerInfo = {
      link_id: authId,
      email: req.body.email,
      mobile: req.body.mobile,
      dateOfBirth: req.body.dateOfBirth,
      jobTitle: req.body.jobTitle,
      pastJobs: req.body.pastJob,
      gender: req.body.gender,
      qualifications: req.body.qualifications,
      techQualifications: req.body.techQualifications,
      state: req.body.state,
      city: req.body.city,
      resume: req.body.resume,
      accountConfirmed: true
    }
    let checkError = checkEmpty(seekerInfo);


    if (!checkError.error) {
      let createUser = await UserProfile(seekerInfo)
      createUser.save()
        .then(result => {
          //* S-Response
          res.json({
            error: false,
            message: "Profile Updated Successfully",
          })
        }).catch((err) => {
          //* E-Response
          res.json({
            error: true,
            message: "Could create user at the moment",
            backError: err
          })
        })
    }
  }

  if (userCheck.type == "employer" && req.body.type == "employer") {

    if (userCheck3.email == userCheck.email) {
      return res.json({
        error: false,
        message: "Profile Part 2 Aready Updated Successfully",
      })
    }

    let empInfo = {
      accountConfirmed: true,
      link_id: userCheck._id,
      email: userCheck.email,
      orgLogo: req.body.orgLogo,
      orgName: req.body.orgName,
      orgEmail: req.body.orgEmail,
      orgPhone: req.body.orgPhone,
      orgAddress: req.body.orgAddress,
      orgWebsite: req.body.orgWebsite,
      orgCountry: req.body.orgCountry,
      pan: req.body.pan,
      gstin: req.body.gstin
    }
    let checkError = checkEmpty(empInfo);

    if (!checkError.error) {
      let createUser = await EmployerProfile(empInfo)
      createUser.save()
        .then(result => {
          //* S-Response
          res.json({
            error: false,
            message: "Profile Updated Successfully",
          })
        }).catch((err) => {
          //* E-Response
          console.log(err);
          res.json({
            error: true,
            message: "Profile part 2 Updation Successfully failed :(",
            backError: err
          })
        })
    }
  }
})



module.exports = account