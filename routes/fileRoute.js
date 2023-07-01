const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({dest: 'uploads'});
const fileController = require('../controllers/fileController');
const {authorize} = require("../middleware/authJwt");


router.post("/uploadFile/:CompanyId", [upload.single('file'), authorize], fileController.uploadFile);


module.exports = router;