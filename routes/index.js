const express = require("express");
const router = express.Router();

const User = require("../models/User");

const withAuth = require("../helpers/middleware");


router.get("/", withAuth, async (req, res, next) => {
  try {
    const currentUser = await User.find({email: req.email})
    res.json(currentUser);
  } catch (error) {
    res.json(error)
  }
});


module.exports = router;