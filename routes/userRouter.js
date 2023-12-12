const express = require('express');

const router = express.Router();

const { userController } = require('../controllers/userController');

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: 유저 추가 수정 삭제 조회
 */

/**
 * @swagger
 * paths:
 *  /users/:
 *    get:
 *      summary: "유저 데이터 전체조회"
 *      description: "서버에 데이터를 보내지 않고 Get방식으로 요청"
 *      tags: [Users]
 *      responses:
 *        "200":
 *          description: 전체 유저 정보
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                    success:
 *                      type: boolean
 *                    message:
 *                      type: string
 *                    users:
 *                      type: array
 *                      example:
 *                          [
 *                            {"id":1,"nickname":"hi","provider":"KAKAO","provider_id":"1235234","champion":"CHAMP1","is_deleted":0,"created_at":"2023-12-12T09:11:44.000Z","updated_at":"2023-12-12T09:11:44.000Z"},
 *                          ]
 */
router.get('/', userController.getUsers);

// /**
//  * @swagger
//  * paths:
//  *  /users/signIn:
//  *      post:
//  *          summary: "카카오 로그인"
//  *          description: "카카오 토큰 확인 뒤 가입되지 않은 유저이면 회원가입 후 로그인"
//  *          tag: [Users]
//  *          requestBody:
//  *
//  */

router.post('/signIn', userController.signIn);

router.post('/');

module.exports = router;
