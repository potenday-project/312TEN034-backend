const { pool } = require('./pool');

const challengeParticipantModel = {
  createChallengeParticipant: async ({ memberId, challengeId, role }) => {
    const connection = await pool.getConnection();

    try {
      const [rows, fields] = await connection.query(
        'INSERT INTO challenge_participant (member_id, challenge_id, role) VALUES (?, ?, ?)',
        [memberId, challengeId, role]
      );
      return rows;
    } finally {
      connection.release();
    }
  },

  getChallengeParticipantsByChallengeId: async ({ challengeId }) => {
    const connection = await pool.getConnection();

    try {
      const [rows, fields] = await connection.query('SELECT * FROM challenge_participant WHERE challenge_id = ?', [
        challengeId,
      ]);

      return rows;
    } finally {
      connection.release();
    }
  },
};

module.exports = {
  challengeParticipantModel,
};
