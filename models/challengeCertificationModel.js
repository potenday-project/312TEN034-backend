const { pool } = require('./pool');

const challengeCertificationModel = {
  getChallengeCertificationsByMemberId: async ({ memberId }) => {
    const connection = await pool.getConnection();

    const [rows, fields] = await connection.query('SELECT * FROM challenge_certification WHERE member_id = ?', [
      memberId,
    ]);

    return rows;
  },

  findNullApproved: async ({ memberId, challengeId }) => {
    const connection = await pool.getConnection();

    const [rows, fields] = await connection.query(
      // 제일 최근의 인증이 NULL이면 true, 아니면 false
      `SELECT is_authenticate FROM challenge_certification WHERE member_id = ${memberId} AND challenge_id = ${chellengeId} ORDER BY participation_count DESC LIMIT 1;`
    );

    return rows;
  },

  submitChallenge: async ({ memberId, challengeId, imageUrl, is_authenticate }) => {
    const connection = await pool.getConnection();

    const query = `
      INSERT INTO challenge_certification (member_id, challenge_id, authenticate_image_url, is_authenticate, participation_count, created_at, updated_at)
      SELECT
      ${memberId} AS member_id,
      ${challengeId} AS challenge_id,
      '${imageUrl}' AS authenticate_image_url,
      NULL AS is_authenticate,
      COALESCE(MAX(participation_count), 0) + ${is_authenticate} AS participation_count,
      NOW() AS created_at,
      NOW() AS updated_at
      FROM challenge_certification
      WHERE member_id = ${memberId} AND challenge_id = ${challengeId};
      `;
    const [rows, fields] = await connection.query(query);

    return rows;
  },
};

module.exports = {
  challengeCertificationModel,
};
