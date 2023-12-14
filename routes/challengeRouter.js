const express = require('express');

const router = express.Router();

const { challengeController } = require('../controllers/challengeController');

/**
 * @swagger
 * paths:
 *  /challenges:
 *      post:
 *          tags: [Challenges]
 *          summary: "챌린지 생성"
 *          description: "챌린지 생성"
 *          requestBody:
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          example : { "name": "챌린지 이름", "category": "카테고리 (ENUM)", "authenticationMethod": "인증 방식", "reward": "보상"}
 *          responses:
 *              "200":
 *                  description: "챌린지 생성 요청에 성공했습니다."
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
 *                                          challengeId:
 *                                              type: number
 *                                              description: "챌린지 아이디"
 */
router.post('/', challengeController.createChallenge);

/**
 * @swagger
 * paths:
 *  /challenges/approve:
 *      post:
 *          tags: [Challenges]
 *          summary: "챌린지 수락"
 *          description: "챌린지 수락"
 *          requestBody:
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          example : { "challengeId": 1 }
 *          responses:
 *              "200":
 *                  description: "챌린지 승인 요청에 성공했습니다."
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
 *                                          challengeId:
 *                                              type: number
 *                                              description: "챌린지 아이디"
 */
router.post('/approve', challengeController.approveChallenge);

module.exports = router;
