const { badgeService } = require('../services/badgeService');
const { getUserIdFromJwt } = require('../utils/jwt');

const badgeController = {
  getBadges: async (req, res) => {
    const result = await badgeService.getBadges({
      memberId: getUserIdFromJwt(req.headers.authorization),
    });

    if (result.success) {
      return res.status(200).json({
        success: true,
        message: '뱃지 조회 요청에 성공했습니다.',
        data: {
          badges: result.data.badges,
        },
      });
    } else {
      return res.status(400).json({
        success: false,
        message: '뱃지 조회 요청에 실패했습니다.',
        err: result.err.message,
      });
    }
  },
};

module.exports = {
  badgeController,
};
