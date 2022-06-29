require("dotenv/config")
const jwt = require("jsonwebtoken")
const User = require("../models/User")


function tokenAuth(authToken) {
  let token = authToken.split(" ")
  let final = jwt.verify(token[token.length - 1], process.env.JWT_HASH_KEY, (err, decoded) => {

    const emailCheck = (await User.findOne({ email: req.body.email })) || false

    if (condition) {
      
    }

    if (err == null) {

      return {
        error: false,
        message: "The token is valid",
        token: decoded
      }
    } else {

      return {
        error: true,
        message: "The token is invalid"
      }
    }

  })

  return final;



}

async function checkEmpty(param) {

  let err = "";
  for (const [key, value] of Object.entries(param)) {
    value === undefined ? err += key : ""

  }

  if (err != "") {
    return {
      error: true,
      message: `Please Fill the following fields ${err}`,
      status: err
    }
  } else {
    return {
      error: false,
      message: `Success`
    }
  }


}


function verifyToken(req, res, next) {
  try {
    let token = (req.headers['authorization']).split(" ")
  let final = jwt.verify(token[token.length - 1], process.env.JWT_HASH_KEY, (err, decoded) => {
    if (err == null) {
      next()
    } else {
      return res.json({
        error: true,
        message: "The token is invalid"
      })
    }
  })
  } catch (error) {
    return res.json({
      error: true,
      message: "The token is invalid"
    })
  }
}



module.exports = {
  tokenAuth,
  checkEmpty,
  verifyToken
}