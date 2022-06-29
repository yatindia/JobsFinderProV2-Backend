const path = require("path")

module.exports = {
  siteName: "Yat Jobs",
  domain: "http://127.0.0.1:5300",
  frontEnd : "http://127.0.0.1:3000",
  // domain: "https://api.jobsfinderpro.com",
  // frontEnd : "https://jobsfinderpro.com",
  mail: {
    host: "smtp.ethereal.email",
    port: 587,
    user: "jarret65@ethereal.email",
    pass: "fHbUDEQkx6UXyU2UMx",
  },
  parentDirectory: __dirname,
  profileDirectory: path.join(__dirname, "/profileImages/"),
  resumeDirectory: path.join(__dirname, "/profileResumes/"),
  backend : {
    name : "Noel Jose",
    email : "noeljose1998af@gmail.com"
  }
}
