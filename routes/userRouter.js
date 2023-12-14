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
 *  /users/signIn:
 *      post:
 *          tags: [Users]
 *          summary: "로그인(토큰 생성)"
 *          description: "카카오 access토큰 확인 뒤 token 생성"
 *          requestBody:
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          example : {"accessToken": "7dpQgQXPMskR78asdfaefabaaef3xw"}
 *                          properties:
 *                              accessToken:
 *                                  type: string
 *                                  description: "카카오 access 토큰"
 *          responses:
 *              "200":
 *                  description: "JWT토큰 생성 요청에 성공했습니다."
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  success:
 *                                      type: boolean
 *                                  message:
 *                                      type: string
 *                                  data:
 *                                      type: object
 *                                      properties:
 *                                          token:
 *                                              type: string
 *                                              description: "토큰"
 *              "401":
 *                  description: "provider_id가 DB에 없어 회원가입 필요, JWT토큰 생성 불가. 요청에 실패했습니다."
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  success:
 *                                      type: boolean
 *                                      example: False
 *                                  message:
 *                                      type: string
 *                                  err:
 *                                      type: object
 *                                      properties:
 *                                          error:
 *                                              type: string
 *                                              description: "에러메세지"
 *
 *
 */
// users/signIn
router.post('/signIn', userController.signIn);
/**
 * @swagger
 * paths:
 *   /users/signUp:
 *     post:
 *       tags: [Users]
 *       summary: "회원가입"
 *       description: "회원가입(accessToken, nickname, champion 값 필요), champion 값은 RED, YELLOW, GREEN, BLUE, PINK, BEIGE 중 하나여야 함"
 *       requestBody:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example: {"nickname": "닉네임", "accessToken": "123456789", "champion": "CHAMP1"}
 *             properties:
 *               nickname:
 *                 type: string
 *                 description: "닉네임"
 *               accessToken:
 *                 type: string
 *                 description: "카카오 access 토큰"
 *               champion:
 *                 type: string
 *                 description: "챔피언 이름(RED, YELLOW, GREEN, BLUE, PINK, BEIGE)"
 *       responses:
 *         "201":
 *           description: "회원가입 요청에 성공했습니다."
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   success:
 *                     type: boolean
 *                   message:
 *                     type: string
 *         "400":
 *           description: "회원가입 요청에 실패했습니다."
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   success:
 *                     type: boolean
 *                     example: False
 *                   message:
 *                     type: string
 */

// users/singUp
router.post('/signUp', userController.signUp);

module.exports = router;
