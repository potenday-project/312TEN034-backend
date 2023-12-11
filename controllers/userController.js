const axios = require('axios');

const { userService } = require('../services/userService');

const userController = {
  getUsers: async (req, res) => {
    const users = await userService.getUsers();

    return res.json({
      success: true,
      message: '유저 정보를 가져왔습니다.',
      users: users || [],
    });
  },
  signIn: async (req, res) => {
    const result = await axios.get('https://kapi.kakao.com/v2/user/me', {
      headers: {
        Authorization: `Bearer ${kakaoToken}`,
      },
    });

    return result.data;
  },
};

module.exports = {
  userController,
};
