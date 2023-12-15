const express = require('express');

const router = express.Router();

const { alarmController } = require('../controllers/alarmController');

/**
 * @swagger
 * paths:
 *   /api/alarms:
 *     get:
 *       tags: [Alarms]
 *       summary: "유저의 알람 전체 조회"
 *       description: "유저의 알람 전체 조회 및 읽음 상태 모두 업데이트"
 *       parameters:
 *         - name: "Authorization"
 *           in: "header"
 *           description: "Access Token"
 *           required: true
 *           schema:
 *             type: "string"
 *       responses:
 *         "200":
 *           description: "유저의 알람 전체 조회 요청에 성공했습니다."
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   success:
 *                     type: boolean
 *                   message:
 *                     type: string
 */
router.get('/', alarmController.getAlarms);

/**
 * @swagger
 * paths:
 *   /api/alarms/new:
 *     get:
 *       tags: [Alarms]
 *       summary: "새로운 알람 존재 여부 조회"
 *       description: "새로운 알람 존재 여부 조회"
 *       parameters:
 *         - name: "Authorization"
 *           in: "header"
 *           description: "Access Token"
 *           required: true
 *           schema:
 *             type: "string"
 *       responses:
 *         "200":
 *           description: "새로운 알람 존재 여부 조회 요청에 성공했습니다."
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   success:
 *                     type: boolean
 *                   message:
 *                     type: string
 */
router.get('/new', alarmController.getNewAlarmExist);

/**
 * @swagger
 * paths:
 *   /api/alarms/approve:
 *     post:
 *       tags: [Alarms]
 *       summary: "상대방 인증 요청 알람 승인"
 *       description: "상대방 인증 요청 알람 승인"
 *       parameters:
 *         - name: "Authorization"
 *           in: "header"
 *           description: "Access Token"
 *           required: true
 *           schema:
 *             type: "string"
 *       requestBody:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 challengeCertificationId:
 *                   type: integer
 *               required:
 *                 - challengeCertificationId
 *               description: "인증 요청 알람의 challengeCertificationId"
 *       responses:
 *         "200":
 *           description: "상대방 인증 요청 알람 승인 요청에 성공했습니다."
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   success:
 *                     type: boolean
 *                   message:
 *                     type: string
 */

router.post('/approve', alarmController.approveAlarm);

/**
 * @swagger
 * paths:
 *   /api/alarms/reject:
 *     post:
 *       tags: [Alarms]
 *       summary: "상대방 인증 요청 알람 거절"
 *       description: "상대방 인증 요청 알람 거절"
 *       parameters:
 *         - name: "Authorization"
 *           in: "header"
 *           description: "Access Token"
 *           required: true
 *           schema:
 *             type: "string"
 *       requestBody:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 challengeCertificationId:
 *                   type: integer
 *               required:
 *                 - challengeCertificationId
 *               description: "인증 요청 알람의 challengeCertificationId"
 *       responses:
 *         "200":
 *           description: "상대방 인증 요청 알람 승인 거절에 성공했습니다."
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   success:
 *                     type: boolean
 *                   message:
 *                     type: string
 */
router.post('/reject', alarmController.rejectAlarm);

module.exports = router;
