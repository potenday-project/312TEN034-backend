const { pool } = require('./pool');

const memberModel = {
  getChallengeProgressInfo: async ({ challengeId }) => {
    const connection = await pool.getConnection();

    try {
      const [rows, fields] = await connection.query(
        'SELECT m.champion, m.id, count(cc.id) count FROM member m LEFT JOIN challenge_certification cc ON m.id = cc.member_id LEFT JOIN challenge c ON cc.challenge_id = c.id WHERE c.id = ? AND cc.is_authenticate = TRUE GROUP BY m.id',
        [challengeId]
      );
    } finally {
      connection.release();
    }

    return rows;
  },
};

module.exports = {
  memberModel,
};
