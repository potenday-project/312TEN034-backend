// 프론트에서 받아온 카카오 토큰을 카카오 API 서버에 보내서 유저 정보를 받아오는 함수
const axios = require('axios');

const signInKakao = async (kakaoToken) => {
  const result = await axios.get('https://kapi.kakao.com/v2/user/me', {
    headers: {
      Authorization: `Bearer ${kakaoToken}`,
    },
  });
  //   console.log(result.data);

  return result.data;
};

module.exports = { signInKakao };
