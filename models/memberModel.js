const { pool } = require('./pool');

const memberModel = {
  getChallengeProgressInfo: async ({ challengeId }) => {
    const connection = await pool.getConnection();

    try {
      const [rows] = await connection.query(
        `
        SELECT
          ch.name AS challengeName,
          ch.category,
          ch.reward,
          m.id,
          m.nickname,
          m.champion,
          COUNT(cc.member_id) AS certificationCount
        FROM
          challenge ch
        JOIN
          challenge_participant cp ON ch.id = cp.challenge_id
        JOIN
          member m ON cp.member_id = m.id
        LEFT JOIN
          challenge_certification cc ON cp.member_id = cc.member_id AND ch.id = cc.challenge_id AND cc.is_authenticate = true
        WHERE
          ch.id = ?
        GROUP BY
          m.id;
        `,
        [challengeId]
      );

      return rows;
    } finally {
      connection.release();
    }
  },
};

module.exports = {
  memberModel,
};
