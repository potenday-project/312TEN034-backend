const { alarmModel } = require('../models/alarmModel');
const { challengeCertificationModel } = require('../models/challengeCertificationModel');

const alarmService = {
  getAlarms: async ({ memberId }) => {
    // 유저의 알람 전체 조회 및 읽음 상태 모두 업데이트
    const alarms = await alarmModel.getAlarms({ memberId });
    await alarmModel.updateAlarmStatus({ memberId });

    const result = Promise.all(
      alarms.map(async (alarm) => {
        const [{ authenticate_image_url }] =
          await challengeCertificationModel.findAuthenticateImageUrlByChallengeCertificationId({
            challengeCertificationId: alarm.challenge_certification_id,
          });

        return {
          ...alarm,
          authenticateImageUrl: authenticate_image_url,
        };
      })
    );

    return result;
  },

  getNewAlarmExist: async ({ memberId }) => {
    const result = await alarmModel.findNewAlarmExist({ memberId });

    return result;
  },

  approveChallengeCertification: async ({ challengeCertificationId }) => {
    const result = await challengeCertificationModel.approveChallengeCertification({
      challengeCertificationId,
    });

    return result;
  },

  rejectChallengeCertification: async ({ challengeCertificationId }) => {
    const result = await challengeCertificationModel.rejectChallengeCertification({
      challengeCertificationId,
    });

    return result;
  },
};

module.exports = {
  alarmService,
};
