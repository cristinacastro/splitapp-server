const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
//const uploader = require("../config/cloudinary");

const Group = require("../models/Group");
const Cost = require("../models/Cost");
const Expense = require("../models/Expense");

const withAuth = require("../helpers/middleware");
const User = require("../models/User");
const { mapReduce } = require("../models/Cost");

router.get("/groups/", withAuth, async (req, res, next) => {
  try {
    const theUser = await User.findOne({email:req.email})
    const allGroups = await Group.find().populate("members").populate("costs")
    const theGroups = allGroups.filter(eachGroup => {

      for (let i = 0; i<eachGroup.members.length; i++){
        if(eachGroup.members[i]._id == theUser._id.toString()){
          return true
        }
      }
    })
    res.json(theGroups);
  } catch (error) {
    res.json(error);
  }
});


router.post("/groups/add", withAuth, async (req, res, next) => {

  try {
    const activeUser = await User.findOne({email:req.email})
    activeUserId = activeUser._id

    const newGroup = {
      name: "",
      image: "",
      members: [activeUserId],
      costs: [],
    };

    const theGroup = await Group.create(newGroup);

    res.json(theGroup);
  } catch (error) {
    res.json(error);
  }
});
//Edit group

router.patch("/groups/edit/:id",withAuth, async (req, res, next) => {
  
    const id = req.body.userID

 
      const theUser = await User.findOne({email:req.email})
      const theGroup = await Group.findByIdAndUpdate(req.params.id, {$push: { members: req.body.members }, name: req.body.name, image:req.body.image}, {new:true})

      res.json(theGroup);
   
  });


//Delete group
router.delete("/groups/delete/:id", async (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  try {
    const theRemovedGroup = await Group.findByIdAndRemove(req.params.id);
    res.json("The group was deleted");
  } catch (error) {
    res.json(error);
  }
});

router.get("/groups/group-details/:id", withAuth, async (req, res, next) => {
  try {
    const thisGroup = await await Group.findById(req.params.id);

    res.json(thisGroup);
  } catch (error) {
    res.json(error);
  }
});

module.exports = router;
