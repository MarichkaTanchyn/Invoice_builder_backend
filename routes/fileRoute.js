const path = require('path');

const express = require('express');

const fileController = require('../controllers/FileController');
const router = express.Router();

router.post("/getFile", fileController.postFile);


module.exports = router;