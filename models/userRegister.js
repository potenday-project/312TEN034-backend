// 카카오 유저정보 DB에 저장(회원가입)
const mysql = require('mysql2/promise');
const pool = require('./pool');

const userRegister = async (userKakaoResult) => {
  const connection = await pool.getConnection();

  const kakao_id = userKakaoResult.id;
  const email = userKakaoResult.kakao_account.email;
  const nickname = userKakaoResult.properties.nickname;
  const profile_image = userKakaoResult.properties.profile_image;

  try {
    const [rows, fields] = await connection.query(
      `INSERT INTO users (kakao_id, email, nickname, profile_image) VALUES (${kakao_id}, '${email}', '${nickname}','${profile_image}');`
    );
    console.log('회원가입 성공');
    return rows;
  } catch (err) {
    console.log('회원가입 오류', err);
  } finally {
    connection.release(); // 반환된 연결 반납
  }
};

module.exports = { userRegister };
