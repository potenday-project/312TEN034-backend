const { pool } = require('./pool');

const memberModel = {
  getChallengeProgressInfo: async ({ challengeId }) => {
    const connection = await pool.getConnection();

    try {
      const [rows, fields] = await connection.query(
        'SELECT m.id, m.nickname, m.champion, cc.is_authenticate, cc.participation_count, ch.name AS challenge_name, ch.category, ch.reward FROM member m JOIN (SELECT cp.member_id, MAX(cc.created_at) AS max_created_at FROM challenge_participant cp JOIN challenge_certification cc ON cp.member_id = cc.member_id AND cp.challenge_id = cc.challenge_id WHERE cp.challenge_id IN (SELECT cp_inner.challenge_id FROM challenge_participant cp_inner WHERE cp_inner.member_id IN (SELECT cp_sub.member_id FROM challenge_participant cp_sub WHERE cp_sub.challenge_id = ?)) GROUP BY cp.member_id) AS latest_certification ON m.id = latest_certification.member_id JOIN challenge_certification cc ON latest_certification.member_id = cc.member_id AND latest_certification.max_created_at = cc.created_at JOIN challenge ch ON cc.challenge_id = ch.id;',
        [challengeId]
      );
      return rows;
    } catch (err) {
      return err;
    } finally {
      connection.release();
    }
  },
};

module.exports = {
  memberModel,
};
