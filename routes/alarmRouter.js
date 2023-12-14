const express = require('express');

const router = express.Router();

const { alarmController } = require('../controllers/alarmController');

/**
 * @swagger
 * paths:
 *   /alarms:
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
 *   /alarms/new:
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

module.exports = router;
