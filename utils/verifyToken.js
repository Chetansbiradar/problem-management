const jsonwebtoken = require("jsonwebtoken");
const User = require("../models/User");

//verify token
async function verifyToken(req, res, next) {
  let token = (req.headers.cookie)
  if (!token) return res.status(401).render("index.hbs");
  token = token.split("=")[1];
  try {
    const verified = jsonwebtoken.verify(token, "someSecretKey");
    req.user = await User.findOne({ _id: verified._id }, { password: 0 });
    console.log("Logged in user: "+req.user.name+" role: "+req.user.role);
    next();
  } catch (err) {
    res.status(400).send(err);
  }
}

module.exports = verifyToken;
