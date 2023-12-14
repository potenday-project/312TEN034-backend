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
      `SELECT is_authenticate, participation_count FROM challenge_certification WHERE member_id = ${memberId} AND challenge_id = ${challengeId} ORDER BY id DESC LIMIT 1;`
    );

    return rows;
  },

  createChallengeCertification: async ({
    memberId,
    challengeId,
    authenticateImageUrl,
    is_authenticate,
    participationCount,
  }) => {
    console.log(memberId, challengeId, authenticateImageUrl, is_authenticate, participationCount);

    const connection = await pool.getConnection();

    if (is_authenticate === null) {
      const [rows, fields] = await connection.query(
        `INSERT INTO challenge_certification (member_id, challenge_id, authenticate_image_url, participation_count) VALUES (?, ?, ?, ?)`,
        [memberId, challengeId, authenticateImageUrl, participationCount]
      );

      return rows;
    }

    const [rows, fields] = await connection.query(`INSERT INTO challenge_certification (?, ?, ?, ?, ?)`, [
      memberId,
      challengeId,
      authenticateImageUrl,
      is_authenticate,
      participationCount,
    ]);

    return rows;
  },

  findAuthenticateImageUrlByChallengeCertificationId: async ({ challengeCertificationId }) => {
    const connection = await pool.getConnection();

    const [rows, fields] = await connection.query(
      `SELECT authenticate_image_url FROM challenge_certification WHERE id = ${challengeCertificationId}`
    );

    return rows;
  },

  approveChallengeCertification: async ({ challengeCertificationId }) => {
    const connection = await pool.getConnection();

    const [rows, fields] = await connection.query(
      `UPDATE challenge_certification SET is_authenticate = true WHERE id = ${challengeCertificationId}`
    );

    return rows;
  },

  rejectChallengeCertification: async ({ challengeCertificationId }) => {
    const connection = await pool.getConnection();

    const [rows, fields] = await connection.query(
      `UPDATE challenge_certification SET is_authenticate = false WHERE id = ${challengeCertificationId}`
    );

    return rows;
  },
};

module.exports = {
  challengeCertificationModel,
};
