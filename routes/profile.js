const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
//const uploader = require("../config/cloudinary");
const User = require("../models/User");
const withAuth = require("../helpers/middleware");


router.get("/profile", withAuth, async (req, res, next) => {
    try {
      const currentUser = await User.findOne({email: req.email})
      res.json(currentUser);
    } catch (error) {
      res.json(error)
    }
  });

router.put("/profile/edit/:id", withAuth, async (req, res, next) => {
    
    if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
        res.status(400).json({ message: 'Specified id is not valid' });
        return;
    }

    const updatedProfile = {
        username: req.body.username,
        image: req.file.url,
        phone: req.body.phone,  
    };
    
    try {
        const theUpdatedProfile = await User.findByIdAndUpdate(req.params.id, updatedProfile)
        res.json(theUpdatedProfile)
    } catch(error){
        res.json(error)
    }
  });



router.get("/profile/allusers", withAuth, async (req, res, next) => {
  try {
    const currentUser = await User.find(req.params.id)
    res.json(currentUser);
  } catch (error) {
    res.json(error)
  }
});

router.get("/profile/allusers/search", withAuth, async (req, res, next) => {
  try {
    const currentUser = await User.find({username: {"$regex":req.query.q, "$options":"i"}})
    res.json(currentUser);
  } catch (error) {
    res.json(error)
  }
});



module.exports = router;