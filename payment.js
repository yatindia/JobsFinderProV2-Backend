//*Imports
require("dotenv/config")
const express = require("express")
const config = require("./config")
const stripe = require("stripe")(process.env.STRIPE_API_KEY)
const EmployerProfile = require("./models/EmployerProfile")
const payment = express()
const mongoose = require("mongoose")

// payment.use(express.json())

//Database Connection
mongoose.connect(
  `mongodb+srv://${process.env.MONGO_DB_USERNAME}:${process.env.MONGO_DB_PASSWORD}@cluster0.fvinp.mongodb.net/yatJobs?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true },
    (msg) => {
      msg != null || "null" ? console.log("Database Connected") : console.log(msg)
    }
  )



payment.post("/webhook", express.raw({type: "*/*"}), async (req, res) => {
    const sig = req.headers['stripe-signature']
    const payload = req.body
    let secret = process.env.STRIPE_WEBHOOK_KEY_1
    let event;
    try {
      event = stripe.webhooks.constructEvent(payload, sig, secret)
        let userId = JSON.parse((req.body).toString('utf8')).data.object.metadata.id || false
        if (userId !== false) {
          let emp = await EmployerProfile.findOne({link_id: userId })
          await EmployerProfile.updateOne({link_id: userId}, {resumePoints: emp.resumePoints+50})
        }
    } catch (error) {
        console.log("error");
        res.sendStatus(500)
        return
    }
    res.sendStatus(200)
})

payment.get("/",(req, res)=>{
res.send("Payment Gate Way")
})

payment.listen(6000)