const { getUserInfoFromKakao } = require('../lib/kakao');
const { userModel } = require('../models/userModel');
const jwt = require('jsonwebtoken');

const userService = {
  // 토큰 정보의 provider_id DB조회
  getUserByProviderId: async (provider_id) => {
    const result = await userModel.getUserByProviderId(provider_id);

    return result;
  },

  // 유저 데이터를 바탕으로 토큰 발급
  makeToken: async (userData) => {
    console.log(userData);
    const { id, nickname, provider, provider_id, champion, is_deleted, created_at, updated_at } = userData;

    const key = process.env.JWT_SECRET_KEY;
    console.log('토큰생성시작', key);
    const expiresIn = '10d'; //토큰 유효 기간

    const token = jwt.sign(
      {
        id,
        nickname,
        provider,
        provider_id,
        champion,
      },
      key,
      {
        expiresIn,
      }
    );
    console.log('토큰 생성 끝!', token);
    return token;
  },

  // 회원가입
  signUp: async (userData) => {
    const {
      data: { id: provider_id },
    } = await getUserInfoFromKakao(userData);
    const result = await userModel.signUp({
      ...userData,
      provider_id,
    });

    return result;
  },

  getUserProfile: async (id) => {
    const result = await userModel.getUserProfile(id);

    return result;
  },
};

module.exports = {
  userService,
};
