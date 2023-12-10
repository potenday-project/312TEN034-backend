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
