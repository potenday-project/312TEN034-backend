const { alarmService } = require('../services/alarmService');
const { getUserIdFromJwt } = require('../utils/jwt');

const alarmController = {
  getAlarms: async (req, res) => {
    // 유저의 알람 전체 조회 및 읽음 상태 모두 업데이트
    try {
      const result = await alarmService.getAlarms({
        memberId: getUserIdFromJwt(req.headers.authorization),
      });

      return res.status(200).json({
        success: true,
        message: '알람 조회에 성공했습니다.',
        data: {
          alarms: result,
        },
      });
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: '알람 조회에 실패했습니다.',
        err: err.message,
      });
    }
  },

  getNewAlarmExist: async (req, res) => {
    try {
      const result = await alarmService.getNewAlarmExist({
        memberId: getUserIdFromJwt(req.headers.authorization),
      });

      return res.status(200).json({
        success: true,
        message: '새로운 알람 존재 여부 조회에 성공했습니다.',
        data: {
          isNewAlarmExist: result,
        },
      });
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: '새로운 알람 존재 여부 조회에 실패했습니다.',
        err: err.message,
      });
    }
  },
  approveAlarm: async (req, res) => {
    const { alarmId, challengeCertificationId } = req.body;

    try {
      await alarmService.approveChallengeCertification({
        alarmId,
        challengeCertificationId,
      });

      return res.status(200).json({
        success: true,
        message: '알람 승인에 성공했습니다.',
      });
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: '알람 승인에 실패했습니다.',
        err: err.message,
      });
    }
  },
  rejectAlarm: async (req, res) => {
    const { alarmId, challengeCertificationId } = req.body;

    try {
      await alarmService.rejectChallengeCertification({
        alarmId,
        challengeCertificationId,
      });

      return res.status(200).json({
        success: true,
        message: '알람 거절에 성공했습니다.',
      });
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: '알람 거절에 실패했습니다.',
        err: err.message,
      });
    }
  },
};

module.exports = {
  alarmController,
};
