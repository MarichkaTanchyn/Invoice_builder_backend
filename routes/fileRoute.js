const path = require('path');

const express = require('express');

const fileController = require('../controllers/fileController');
const router = express.Router();

router.post("/getFile", fileController.postFile);


module.exports = router;