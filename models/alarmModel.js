const { pool } = require('./pool');

const alarmModel = {
  getAlarms: async ({ memberId }) => {
    const connection = await pool.getConnection();

    const [rows, fields] = await connection.query('SELECT * FROM alarm WHERE member_id = ? ORDER BY id DESC', [
      memberId,
    ]);
    return rows;
  },

  updateAlarmStatus: async ({ memberId }) => {
    const connection = await pool.getConnection();

    const [rows, fields] = await connection.query('UPDATE alarm SET is_read = 1 WHERE member_id = ? AND is_read = 0', [
      memberId,
    ]);
    return rows;
  },

  findNewAlarmExist: async ({ memberId }) => {
    const connection = await pool.getConnection();

    const [rows, fields] = await connection.query('SELECT * FROM alarm WHERE member_id = ? AND is_read = 0', [
      memberId,
    ]);

    return rows.length > 0;
  },
};

module.exports = {
  alarmModel,
};
