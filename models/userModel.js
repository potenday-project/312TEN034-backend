// DB의 전체 유저 정보 가져오는 함수
const mysql = require('mysql2/promise');
const pool = require('./pool');

const userModel = async () => {
  const connection = await pool.getConnection();

  try {
    const [rows, fields] = await connection.query('SELECT * FROM users');
    // console.log(rows);
    return rows;
  } finally {
    connection.release(); // 반환된 연결 반납
  }
};

module.exports = { userModel };
