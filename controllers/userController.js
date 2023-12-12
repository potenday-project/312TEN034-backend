const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

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
        Authorization: `Bearer ${process.env.KaKao_Tokken}`,
      },
    });
    res.json({ a: result.data });

    return result.data;
  },
};

module.exports = {
  userController,
};
