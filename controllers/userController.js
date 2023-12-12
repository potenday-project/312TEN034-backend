const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

const { userService } = require('../services/userService');

const userController = {
  signIn: async (req, res) => {
    const accessToken = req.body.accessToken;
    // 1. 토큰 정보 받아오기(실패시 오류) -> 2. 토큰 정보의 provider_id DB조회 -> 3. provider_id가 없으면 회원가입 후 로그인(있으면 바로 로그인)
    try {
      // 1. 토큰 정보 받아오기
      const result = await axios.get('https://kapi.kakao.com/v2/user/me', {
        headers: {
          // Authorization: `Bearer ${process.env.KaKao_Tokken}`,
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const provider_id = result.data.id;

      // 2. 토큰 정보의 provider_id DB조회
      const userData = await userService.getUserByproviderId(provider_id);
      console.log(provider_id);

      // 3.provider_id가 있으면 토큰만듦(없으면 null)
      const token = userData[0] ? await userService.makeToken(userData[0]) : null;

      if (token) {
        return res.status(200).json({
          success: true,
          message: 'JWT토큰 생성 요청에 성공했습니다.',
          data: {
            token,
          },
        });
      } else {
        return res.status(401).json({
          success: false,
          message: 'provider_id가 DB에 없어 회원가입 필요, JWT토큰 생성 불가. 요청에 실패했습니다.',
          data: {
            token,
          },
        });
      }
    } catch (err) {
      // 토큰 정보 받아오기 실패
      return res.status(401).json({
        success: false,
        message: '카카오 access 토큰이 유효하지 않습니다.',
        err: err,
      });
    }
  },

  signUp: async (req, res) => {
    const result = await userService.signUp(req.body);
    if (result.success) {
      return res.status(201).json({ result: result.result });
    } else {
      return res.status(400).json({ result: result.result });
    }
  },

  // 유저 프로필 조회
  getUserProfile: async (req, res) => {
    const { id } = req.params;

    // const result = await userService.getUserProfile(id);

    // return res.status(200).json({ result: result });
  },
};

module.exports = {
  userController,
};
