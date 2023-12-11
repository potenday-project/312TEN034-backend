const { pool } = require('./pool');

const userModel = {
  getUsers: async () => {
    const connection = await pool.getConnection();

    try {
      const [rows, fields] = await connection.query('SELECT * FROM member');

      return rows;
    } finally {
      connection.release();
    }
  },

  getUserByKakaoId: async (kakaoId) => {
    const connection = await pool.getConnection();

    try {
      const [rows, fields] = await connection.query('SELECT * FROM member WHERE kakao_id = ?', kakaoId);

      return rows;
    } finally {
      connection.release();
    }
  },

  userRegister: async (userKakaoResult) => {
    const connection = await pool.getConnection();

    const { id: kakao_id, email, nickname, profile_image } = userKakaoResult;

    try {
      const [rows, fields] = await connection.query(
        `INSERT INTO member (kakao_id, email, nickname, profile_image) VALUES (${kakao_id}, '${email}', '${nickname}','${profile_image}');`
      );
      console.log('회원가입 성공');
      return rows;
    } catch (err) {
      console.log('회원가입 오류', err);
    } finally {
      connection.release();
    }
  },
};

module.exports = {
  userModel,
};
