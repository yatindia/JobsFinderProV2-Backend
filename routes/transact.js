//*Imports
require("dotenv/config")
const express = require("express")
const config = require("../config")
const stripe = require("stripe")(process.env.STRIPE_API_KEY)
const EmployerProfile = require("../models/EmployerProfile")
const User = require("../models/User")
const payment = express()

payment.use(express.json())

payment.post("/webhook", async (req, res) => {
    let userId = req.body.data.object.metadata.id
    let emp = await EmployerProfile.findOne({link_id: userId })
    await EmployerProfile.updateOne({link_id: userId}, {resumePoints: emp.resumePoints+50})
})

payment.post("/", async (req, res) => {
  
    try {
        let link_id = req.body.link_id

        const checkEmployer = (await User.findById(link_id)) || false
    
        if (checkEmployer == false) {
    
            return res.json({  paymentURL : `${config.frontEnd}/employers/dashboard/payment?success=false` })
        }
    
        let stripeURL = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            line_items: [{
                price_data: {
                    currency: 'inr',
                    product_data: {
                        name: "Testing The Gate Way"
                    },
                    unit_amount: 250000,
                },
                quantity: 1,
            }],
            metadata: {
                id : link_id
            },
            success_url: `${config.frontEnd}/employers/dashboard/payment?success=true`,
            cancel_url:  `${config.frontEnd}/employers/dashboard/payment?success=false`
    
        })
    
        return res.json({  paymentURL : stripeURL.url })
    } catch (error) {
        return res.json({  paymentURL : `${config.frontEnd}/employers/dashboard/payment?success=false` })
    }
})

module.exports = payment