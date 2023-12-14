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
};

module.exports = {
  challengeModel,
};
