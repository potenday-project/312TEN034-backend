// loginCtrl.js
// 카카오 사용자 정보를 받아와서 DB에 저장된 유저인지 확인하는 컨트롤러
// DB에 저장된 유저라면 정상 로그인 처리하고, DB에 저장된 유저가 아니라면 회원가입 처리 후 로그인처리
const axios = require('axios');

const { signInKakao } = require('./signInKakao'); // 카카오 사용자 정보 가져오기
const { userKakaoIdFind } = require('../models/userKakaoIdFind'); // DB에 저장된 유저인지 확인
const { userRegister } = require('../models/userRegister'); // 유저 회원가입

const loginCtrl = async (req, res, next) => {
  const token = 'Rt2_1A6ueSVMJQRCmwTuwfuoVyj-dTPE47AKPXObAAABjFGFBgJONYg--5I0Sw'; // 카카오 토큰

  // 유저 회원정보
  const userKakaoResult = await signInKakao(`${token}`); // 카카오 사용자 정보
  const userKakaoId = userKakaoResult.id; // 카카오 사용자 id
  const result = await userKakaoIdFind(userKakaoId); // DB에 저장된 유저 정보

  if (result.length === 0) {
    // DB에 저장된 유저가 아니라면 회원가입 처리 후 로그인 처리
    console.log('DB에 저장된 유저가 아님, 회원가입 후 로그인진행');
    // 회원가입 처리
    const userRegisterResult = await userRegister(userKakaoResult);

    // 로그인 처리
  } else {
    // DB에 저장된 유저라면 정상 로그인 처리
    console.log('DB에 저장된 유저, 로그인진행');
  }

  // const { id, email, name, kakao_id, profile_image, created_at } = userModels[0]; // DB에 저장된 유저 정보

  res.send(userKakaoResult);
};

module.exports = { loginCtrl };
