const { pool } = require('./pool');

const challengeCertificationModel = {
  getChallengeCertificationsByMemberId: async ({ memberId }) => {
    const connection = await pool.getConnection();

    const [rows, fields] = await connection.query('SELECT * FROM challenge_certification WHERE member_id = ?', [
      memberId,
    ]);

    return rows;
  },
};

module.exports = {
  challengeCertificationModel,
};
