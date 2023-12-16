const { pool } = require('./pool');

const alarmModel = {
  getAlarms: async ({ memberId }) => {
    const connection = await pool.getConnection();

    try {
      const [rows, fields] = await connection.query('SELECT * FROM alarm WHERE member_id = ? ORDER BY id DESC', [
        memberId,
      ]);
      return rows;
    } finally {
      connection.release();
    }
  },

  updateAlarmStatus: async ({ memberId }) => {
    const connection = await pool.getConnection();

    try {
      const [rows, fields] = await connection.query(
        'UPDATE alarm SET is_read = 1 WHERE member_id = ? AND is_read = 0',
        [memberId]
      );
      return rows;
    } finally {
      connection.release();
    }
  },

  findNewAlarmExist: async ({ memberId }) => {
    const connection = await pool.getConnection();

    try {
      const [rows, fields] = await connection.query('SELECT * FROM alarm WHERE member_id = ? AND is_read = 0', [
        memberId,
      ]);

      return rows.length > 0;
    } finally {
      connection.release();
    }
  },

  createCertificationAlarm: async ({ memberId, challengeCertificationId }) => {
    const connection = await pool.getConnection();

    try {
      const [rows, fields] = await connection.query(
        'INSERT INTO alarm (member_id, challenge_certification_id, alarm_type) VALUES (?, ?, "REQUEST")',
        [memberId, challengeCertificationId]
      );

      return rows;
    } finally {
      connection.release();
    }
  },

  createApproveAlarm: async ({ memberId, challengeCertificationId }) => {
    const connection = await pool.getConnection();

    try {
      const [rows, fields] = await connection.query(
        'INSERT INTO alarm (memberId, challenge_certification_id, alarm_type) VALUES (?, ?, "SUCCESS")',
        [memberId, challengeCertificationId]
      );

      return rows;
    } finally {
      connection.release();
    }
  },

  createRejectAlarm: async ({ memberId, challengeCertificationId }) => {
    const connection = await pool.getConnection();

    try {
      const [rows, fields] = await connection.query(
        'INSERT INTO alarm (memberId, challenge_certification_id, alarm_type) VALUES (?, ?, "RE-REQUEST")',
        [memberId, challengeCertificationId]
      );

      return rows;
    } finally {
      connection.release();
    }
  },
};

module.exports = {
  alarmModel,
};
