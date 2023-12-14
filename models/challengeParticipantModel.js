const { pool } = require('./pool');

const challengeParticipantModel = {
  createChallengeParticipant: async ({ memberId, challengeId, role }) => {
    const connection = await pool.getConnection();

    const [rows, fields] = await connection.query(
      'INSERT INTO challenge_participant (member_id, challenge_id, role) VALUES (?, ?, ?)',
      [memberId, challengeId, role]
    );

    return rows;
  },

  getChallengeParticipantsByChallengeId: async ({ challengeId }) => {
    const connection = await pool.getConnection();

    const [rows, fields] = await connection.query('SELECT * FROM challenge_participant WHERE challenge_id = ?', [
      challengeId,
    ]);

    return rows;
  },
};

module.exports = {
  challengeParticipantModel,
};
