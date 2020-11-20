const express = require('express');
const { reset } = require('nodemon');
const router = express.router();

const uploader = require("../configs/cloudinary-setup");

router.post('/upload', uploader.single('image'), (req,res,next) => {
    if (!req.file){
        next(new Error("No file uploaded"));
        return;
    }

    res.json({secure_url: req.file.secure_url});

});
module.exports = router;