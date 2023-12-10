var express = require('express');
var router = express.Router();
const axios = require('axios');

const loginCtrl = require('../controllers/loginCtrl');

/* GET home page. */
router.get('/users', loginCtrl.loginCtrl);

module.exports = router;
