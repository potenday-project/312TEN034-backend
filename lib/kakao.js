const axios = require('axios');

const getUserInfoFromKakao = async ({ accessToken }) => {
  try {
    const result = await axios.get('https://kapi.kakao.com/v2/user/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return result;
  } catch (err) {
    throw err;
  }
};

module.exports = {
  getUserInfoFromKakao,
};
