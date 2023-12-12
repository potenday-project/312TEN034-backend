// 프론트에서 받아온 카카오 토큰을 카카오 API 서버에 보내서 유저 정보를 받아오는 함수
const axios = require('axios');

const { userModel } = require('../models/userModel');

const userService = {
  getUsers: async () => {
    const result = await userModel.getUsers();

    return result;
  },
};

module.exports = {
  userService,
};
