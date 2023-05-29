const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({dest: 'uploads'});
const fileController = require('../controllers/fileController');


router.post("/uploadFile/:CompanyId", upload.single('file'), fileController.uploadFile);


module.exports = router;