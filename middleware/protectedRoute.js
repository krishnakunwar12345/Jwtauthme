const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();
const User = require("../models/User");
const autheticate = async (req, res, next) => {
  // check the token
  const authHeader = req.header["authorization"];

  if (!authHeader) {
    return res.status(401).json({ message: "Unauthoried.." });
  }
  //if header is available then extract token for the same
  const token = authHeader.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "Unauthoried.." });
  }
  try {
    //verify and decode the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById({ _id: decoded._id }, { password: 0 });
    //check if the user exist
    if (!user) {
      return res.status(401).json({ message: "Unauthoried.." });
    }
    req.user = user;
    // proceed to route
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthoried.." });
  }
};

module.exports = autheticate;
