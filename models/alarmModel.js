const { pool } = require('./pool');

const alarmModel = {
  getAlarms: async ({ memberId }) => {
    const connection = await pool.getConnection();

    try {
      const [rows, fields] = await connection.query(
        'SELECT alarm.id, alarm.member_id, alarm.challenge_certification_id, alarm.alarm_type, alarm.is_read, challenge_certification.challenge_id, challenge.name FROM alarm JOIN challenge_certification ON alarm.challenge_certification_id = challenge_certification.id JOIN challenge ON challenge_certification.challenge_id = challenge.id WHERE alarm.member_id = ? AND alarm.is_active = 1 ORDER BY alarm.id DESC',
        [memberId]
      );

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

  deleteAlarm: async ({ alarmId }) => {
    const connection = await pool.getConnection();

    try {
      const [rows, fields] = await connection.query('UPDATE alarm SET is_active = 0 WHERE id = ?', [alarmId]);

      return rows;
    } finally {
      connection.release();
    }
  },
};

module.exports = {
  alarmModel,
};
