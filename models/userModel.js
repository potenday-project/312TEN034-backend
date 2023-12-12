const { pool } = require('./pool');

const userModel = {
  // 토큰 정보의 provider_id DB조회
  getUserByproviderId: async (provider_id) => {
    const connection = await pool.getConnection();

    try {
      const [rows, fields] = await connection.query('SELECT * FROM member WHERE provider_id = ?', provider_id);

      return rows;
    } finally {
      connection.release();
    }
  },

  signUp: async (userData) => {
    const connection = await pool.getConnection();

    const { nickname, provider_id, champion } = userData;

    try {
      const [rows, fields] = await connection.query(
        `INSERT INTO member (nickname, provider, provider_id, champion) VALUES ('${nickname}', 'KAKAO', '${provider_id}', '${champion}');`
      );
      return {
        success: true,
        message: '회원가입 요청에 성공했습니다',
      };
    } catch (err) {
      return { success: false, message: '회원가입 요청에 실패했습니다.', err };
    } finally {
      connection.release();
    }
  },
};

module.exports = {
  userModel,
};
