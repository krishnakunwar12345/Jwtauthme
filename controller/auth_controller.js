const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();
const register = async (req, res) => {
  try {
    console.log(req.body);
    // get data from the request body
    const { name, username, email, password } = req.body;
    if (!name || !username || !email || !password) {
      return res.status(400).json({
        message: "All fields are mandatory",
      });
    }
    // check email fields must be unique
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        message: "User with provided email is already registered",
      });
    }
    user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({
        message: "User with provided username is already registered",
      });
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, username, password: hashPassword });
    const resp = await newUser.save();
    res.status(201).json({ message: "User Registered successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occured while registraction", error });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required.." });
    }
    let user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "Email not registered with us yet..." });
    }
    const match = await bcrypt.compare(password, user.password);
    const payload = {
      _id: user.id,
      name: user.name,
      email: user.email,
    };
    if (match) {
      const token = await jwt.sign(payload, process.env.JWT_SECRET);
      return res.status(200).json({ message: "Logga in successfully", token });
    } else {
      return res
        .status(400)
        .json({ message: "Email and password incrroct..." });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error occured.." });
  }
};

module.exports = {
  register,
  login,
};
