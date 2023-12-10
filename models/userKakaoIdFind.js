// 받은 카카오 아이디로 DB조회 후 결과 반환 함수

const mysql = require('mysql2/promise');
const pool = require('./pool');

const userKakaoIdFind = async (kakaoId) => {
  const connection = await pool.getConnection();

  try {
    const [rows, fields] = await connection.query('SELECT * FROM users WHERE kakao_id = ?', kakaoId);
    // console.log(rows);
    return rows;
  } finally {
    connection.release(); // 반환된 연결 반납
  }
};

module.exports = { userKakaoIdFind };
