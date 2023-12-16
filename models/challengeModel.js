const { pool } = require('./pool');

const challengeModel = {
  createChallenge: async ({ name, category, authenticationMethod, reward, targetCount }) => {
    const connection = await pool.getConnection();

    try {
      const [rows, fields] = await connection.query(
        'INSERT INTO challenge (name, category, authentication_method, reward, target_count) VALUES (?, ?, ?, ?, ?)',
        [name, category, authenticationMethod, reward, targetCount]
      );
      return rows;
    } finally {
      connection.release();
    }
  },

  startChallenge: async ({ challengeId }) => {
    const connection = await pool.getConnection();

    try {
      const [rows, fields] = await connection.query('UPDATE challenge SET challenge_status = "PROGRESS" WHERE id = ?', [
        challengeId,
      ]);
      return rows;
    } finally {
      connection.release();
    }
  },

  approveChallenge: async ({ memberId, challengeId }) => {
    const connection = await pool.getConnection();

    try {
      const [rows, fields] = await connection.query(
        `INSERT INTO challenge_participant (member_id, challenge_id, role) VALUES (?, ?, 'MEMBER')`,
        [memberId, challengeId]
      );
      console.log('고쳤음', rows);
      return rows;
    } finally {
      connection.release();
    }
  },

  getUpcomingChallenge: async ({ challengeId }) => {
    const connection = await pool.getConnection();

    try {
      const [rows, fields] = await connection.query('SELECT * FROM challenge WHERE id = ?', [challengeId]);
      return rows[0];
    } finally {
      connection.release();
    }
  },

  getChallengeOwner: async ({ challengeId }) => {
    const connection = await pool.getConnection();

    try {
      const [rows, fields] = await connection.query(
        'SELECT member.nickname FROM member WHERE id IN (SELECT member_id FROM challenge_participant WHERE challenge_id = ? AND role = "OWNER")',
        [challengeId]
      );
      return rows[0];
    } finally {
      connection.release();
    }
  },

  getInProgressChallenge: async ({ challengeId }) => {
    const connection = await pool.getConnection();

    try {
      const [rows, fields] = await connection.query('SELECT * FROM challenge WHERE id = ?', [challengeId]);
      return rows;
    } finally {
      connection.release();
    }
  },

  findChallengesByMemberId: async ({ memberId }) => {
    const connection = await pool.getConnection();

    try {
      const [rows, fields] = await connection.query(
        'SELECT * FROM challenge WHERE id IN (SELECT challenge_id FROM challenge_participant WHERE member_id = ?) AND challenge_status = "PROGRESS"',
        [memberId]
      );

      return rows;
    } finally {
      connection.release();
    }
  },

  findExplorationCountByMemberId: async ({ memberId }) => {
    const connection = await pool.getConnection();

    try {
      const [rows, fields] = await connection.query(
        `SELECT COUNT(DISTINCT cT.id) FROM challenge cT LEFT JOIN challenge_certification ccT ON cT.id = ccT.challenge_id LEFT JOIN member m ON ccT.member_id = m.id WHERE m.id = ? AND cT.challenge_status = "PROGRESS";`,
        [memberId]
      );

      return rows;
    } finally {
      connection.release();
    }
  },

  findCertificatedCountByMemberId: async ({ memberId }) => {
    const connection = await pool.getConnection();

    try {
      const [rows, fields] = await connection.query(
        'SELECT COUNT(DISTINCT cT.id) FROM challenge cT LEFT JOIN challenge_certification ccT ON cT.id = ccT.challenge_id LEFT JOIN member m ON ccT.member_id = m.id WHERE m.id = ? AND DATE(ccT.created_at) = CURDATE();',
        [memberId]
      );

      return rows;
    } finally {
      connection.release();
    }
  },
};

module.exports = {
  challengeModel,
};
