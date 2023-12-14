const { pool } = require('./pool');

const challengeModel = {
  createChallenge: async ({ name, category, authenticationMethod, reward, targetCount }) => {
    const connection = await pool.getConnection();

    const [rows, fields] = await connection.query(
      'INSERT INTO challenge (name, category, authentication_method, reward, target_count) VALUES (?, ?, ?, ?, ?)',
      [name, category, authenticationMethod, reward, targetCount]
    );
    return rows;
  },

  startChallenge: async ({ challengeId }) => {
    const connection = await pool.getConnection();

    const [rows, fields] = await connection.query('UPDATE challenge SET challenge_status = "PROGRESS" WHERE id = ?', [
      challengeId,
    ]);
    return rows;
  },

  approveChallenge: async ({ memberId, challengeId }) => {
    const connection = await pool.getConnection();

    const [rows, fields] = await connection.query(
      'INSERT INTO challenge_participant (member_id, challenge_id, role) VALUES (?, ?, ?)',
      [memberId, challengeId, 'MEMBER']
    );
    return rows;
  },

  getUpcomingChallenge: async ({ challengeId }) => {
    const connection = await pool.getConnection();

    const [rows, fields] = await connection.query('SELECT * FROM challenge WHERE id = ?', [challengeId]);
    return rows;
  },

  getInProgressChallenge: async ({ challengeId }) => {
    const connection = await pool.getConnection();

    const [rows, fields] = await connection.query('SELECT * FROM challenge WHERE id = ?', [challengeId]);
    return rows;
  },
};

module.exports = {
  challengeModel,
};
