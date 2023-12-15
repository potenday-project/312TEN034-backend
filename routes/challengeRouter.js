const express = require('express');

const router = express.Router();

const { challengeController } = require('../controllers/challengeController');

const multer = require('multer');
const multerS3 = require('multer-s3');
const { S3Client } = require('@aws-sdk/client-s3');

const s3 = new S3Client({
  region: 'ap-northeast-2',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'dodals3',
    key: function (req, file, cb) {
      cb(null, Date.now().toString());
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

/**
 * @swagger
 * paths:
 *  /api/challenges:
 *      post:
 *          tags: [Challenges]
 *          summary: "챌린지 생성"
 *          description: "챌린지 생성"
 *          parameters:
 *            - name: "Authorization"
 *              in: "header"
 *              description: "Access Token"
 *              required: true
 *              schema:
 *                type: "string"
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
 *  /api/challenges/approve:
 *      post:
 *          tags: [Challenges]
 *          summary: "챌린지 수락"
 *          description: "챌린지 수락"
 *          parameters:
 *              - name: "Authorization"
 *                in: "header"
 *                description: "Access Token"
 *                required: true
 *                schema:
 *                  type: "string"
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

/**
 * @swagger
 * paths:
 *  /api/challenges:
 *      get:
 *          tags: [Challenges]
 *          summary: "유저의 현재 진행 중인 챌린지 전체 조회"
 *          description: "유저의 현재 진행 중인 챌린지 전체 조회"
 *          responses:
 *              "200":
 *                  description: "챌린지 조회 요청에 성공했습니다."
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  success:
 *                                      type: boolean
 *                                  message:
 *                                      type: string
 */
router.get('/', challengeController.getChallenges);

/**
 * @swagger
 * paths:
 *  /api/challenges/today:
 *      get:
 *          tags: [Challenges]
 *          summary: "유저의 오늘 챌린지 진행 상태 조회"
 *          description: "유저의 오늘 챌린지 진행 상태 조회"
 *          responses:
 *              "200":
 *                  description: "챌린지 조회 요청에 성공했습니다."
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  success:
 *                                      type: boolean
 *                                  message:
 *                                      type: string
 */
router.get('/today', challengeController.getTodayChallengeStatus);

/**
 * @swagger
 * paths:
 *  /api/challenges/upcoming/{id}:
 *      get:
 *          tags: [Challenges]
 *          summary: "진행 전인 챌린지 조회"
 *          description: "진행 전인 챌린지 조회"
 *          parameters:
 *             - in: path
 *               name: id
 *               type: integer
 *               description: "챌린지 아이디"
 *          responses:
 *              "200":
 *                  description: "챌린지 조회 요청에 성공했습니다."
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
router.get('/upcoming/:id', challengeController.getUpcomingChallenge);

/**
 * @swagger
 * paths:
 *  /api/challenges/in-progress/{id}:
 *      get:
 *          tags: [Challenges]
 *          summary: "진행 중인 챌린지의 진행 상태 조회"
 *          description: "진행 중인 챌린지의 진행 상태 조회"
 *
 *          parameters:
 *             - name: "Authorization"
 *               in: "header"
 *               description: "Access Token"
 *               required: true
 *               schema:
 *                  type: "string"
 *             - in: path
 *               name: id
 *               type: integer
 *               description: "챌린지 아이디"
 *          responses:
 *              "200":
 *                  description: "진행 중인 챌린지의 진행 상태 조회 요청에 성공했습니다."
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
 *                                      type: array
 *                                      items:
 *                                        type: object
 *                                        properties:
 *                                          champion:
 *                                             type: number
 *                                             description: "유저의 챔피언"
 *                                          id:
 *                                             type: number
 *                                             description: "유저 아이디"
 *                                          count:
 *                                            type: number
 *                                            description: "챌린지 인증 횟수"
 */
router.get('/in-progress/:id', challengeController.getInProgressChallenge);

/**
 * @swagger
 * paths:
 *   /api/challenges/submit:
 *     post:
 *       tags: [Challenges]
 *       summary: "챌린지 인증 요청"
 *       parameters:
 *         - name: "Authorization"
 *           in: "header"
 *           description: "Access Token"
 *           required: true
 *           schema:
 *             type: "string"
 *       requestBody:
 *         content:
 *           multipart/form-data:
 *             schema:
 *               type: object
 *               properties:
 *                 image:
 *                   type: string
 *                   format: binary
 *                 challengeId:
 *                   type: integer
 *               description: "챌린지 아이디"
 *       responses:
 *         "200":
 *           description: "챌린지 인증 요청에 성공했습니다."
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   success:
 *                     type: boolean
 *                   message:
 *                     type: string
 *                     example: "챌린지 인증 요청에 성공했습니다."
 */
router.post('/submit', upload.single('image'), challengeController.submitImage);

module.exports = router;
