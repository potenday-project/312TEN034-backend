const { pool } = require('./pool');

const userModel = {
  // 토큰 정보의 provider_id DB조회
  getUserByProviderId: async (provider_id) => {
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

  getUserProfile: async (id) => {
    const connection = await pool.getConnection();

    try {
      const [rows] = await connection.query('SELECT * FROM member WHERE id = ?', [id]);

      return rows;
    } finally {
      connection.release();
    }
  },

  getUserStatus: async (id) => {
    const connection = await pool.getConnection();

    try {
      try {
        const [completedCountRows] = await connection.query(
          `SELECT COUNT(m.id) FROM challenge cT LEFT JOIN challenge_participant cpT ON cT.id = cpT.challenge_id LEFT JOIN member m ON cpT.member_id = m.id LEFT JOIN challenge_certification ccT ON cT.id = ccT.challenge_id WHERE m.id = ? AND cT.challenge_status = 'SUCCESS' AND ccT.participation_count = cT.target_count;`,
          [id]
        );

        const [memberCountRows] = await connection.query(
          `SELECT COUNT(DISTINCT m.id) 'friendCount', COUNT(m.id) 'startedCount' FROM challenge cT RIGHT JOIN (SELECT cT.id FROM challenge cT LEFT JOIN challenge_certification ccT ON cT.id = ccT.challenge_id LEFT JOIN member m ON ccT.member_id = m.id WHERE m.id = ? AND ccT.participation_count = 1 AND ccT.is_authenticate = 1 GROUP BY cT.id) myctT ON cT.id = myctT.id LEFT JOIN challenge_certification ccT ON cT.id = ccT.challenge_id LEFT JOIN member m ON ccT.member_id = m.id WHERE m.id != ? AND ccT.participation_count = 1 AND ccT.is_authenticate = 1;`,
          [id, id]
        );

        return [completedCountRows, memberCountRows];
      } finally {
        connection.release();
      }

      return rows;
    } finally {
      connection.release();
    }
  },
};

module.exports = {
  userModel,
};
