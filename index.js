//Imports
require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")
const config = require("./config")
const cors = require("cors")
const app = express()

const jwt = require("jsonwebtoken")

//Imp Variables
const port = process.env.PORT

//Global Midwares

//*--------------------Imported Routes--------------------//
const transactRoute = require("./routes/transact")
const accountRoute = require("./routes/account")
const profileRoute = require("./routes/profile")
const jobRoute = require("./routes/job")
const backendRoute = require("./routes/backend")
const guestROute = require("./routes/guest")



//functions
app.use(cors())
app.set("view engine", "ejs")
app.use(express.json())
app.use("/assets", express.static("assets"))
app.use("/img", express.static("img"))
app.use("/account", accountRoute)
app.use("/profile", profileRoute)
app.use("/job", jobRoute)
app.use("/payment", transactRoute)
app.use("/backend", backendRoute)
app.use("/guest", guestROute)
//Database Connection
mongoose.connect(
  `mongodb+srv://${process.env.MONGO_DB_USERNAME}:${process.env.MONGO_DB_PASSWORD}@cluster0.fvinp.mongodb.net/yatJobs?retryWrites=true&w=majority`,
  { useNewUrlParser: true, useUnifiedTopology: true }

)




// //*--------------------Routes--------------------//
app.get("/", (req, res) => {
  res.render("index")
})

// //*--------------------Routes--------------------//
app.get("/jobsView", (req, res) => {
  res.render("jobsView")
})

// //*--------------------Token--------------------//
// app.get("/token", (req, res) => {
//   res.send(jwt.sign({ em: "sdsd" }, process.env.JWT_HASH_KEY, { expiresIn: "10D" }))
// })


// //*--------------------404 ROUTE--------------------//
app.get("*", (req, res) => {
  res.status(404).json({
    error: "404 ERR__PAGE_NOT_FOUND",
  })
})

app.listen(port)
