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

  findChallengesByMemberId: async ({ memberId }) => {
    const connection = await pool.getConnection();

    // 현재 진행 중인 챌린지 전체 조회 (status: PROGRESS)
    const [rows, fields] = await connection.query(
      'SELECT * FROM challenge WHERE id IN (SELECT challenge_id FROM challenge_participant WHERE member_id = ?) AND challenge_status = "PROGRESS"',
      [memberId]
    );

    return rows;
  },

  findExplorationCountByMemberId: async ({ memberId }) => {
    const connection = await pool.getConnection();

    const [rows, fields] = await connection.query(
      `SELECT COUNT(DISTINCT cT.id) FROM challenge cT LEFT JOIN challenge_certification ccT ON cT.id = ccT.challenge_id LEFT JOIN member m ON ccT.member_id = m.id WHERE m.id = ? AND cT.challenge_status = "PROGRESS";`,
      [memberId]
    );

    return rows;
  },

  findCertificatedCountByMemberId: async ({ memberId }) => {
    const connection = await pool.getConnection();

    const [rows, fields] = await connection.query(
      'SELECT COUNT(DISTINCT cT.id) FROM challenge cT LEFT JOIN challenge_certification ccT ON cT.id = ccT.challenge_id LEFT JOIN member m ON ccT.member_id = m.id WHERE m.id = ? AND DATE(ccT.created_at) = CURDATE();',
      [memberId]
    );

    return rows;
  },
};

module.exports = {
  challengeModel,
};
