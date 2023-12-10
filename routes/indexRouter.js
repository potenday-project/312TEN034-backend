var express = require('express');
var router = express.Router();
const axios = require('axios');

const loginCtrl = require('../controllers/loginCtrl');

router.get('/users', loginCtrl.loginCtrl); // 카카오로 유저 회원가입, 로그인

module.exports = router;
