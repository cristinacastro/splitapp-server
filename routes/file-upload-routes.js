const express = require('express');
const router = express.Router();

const uploader = require("../config/cloudinary-setup");

router.post('/upload', uploader.single('image'), (req,res,next) => {
    if (!req.file){
        next(new Error("No file uploaded"));
        return;
    }

    res.json({secure_url: req.file.secure_url});

});
module.exports = router;