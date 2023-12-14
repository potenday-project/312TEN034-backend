const { challengeService } = require('../services/challengeService');
const { extractJwtPayload, getUserIdFromJwt } = require('../utils/jwt');

const challengeController = {
  createChallenge: async (req, res) => {
    const { name, category, authenticationMethod, reward } = req.body;

    const TARGET_COUNT = 10;

    const result = await challengeService.createChallenge({
      userId: getUserIdFromJwt(req.headers.authorization),
      name,
      category,
      authenticationMethod,
      reward,
      targetCount: TARGET_COUNT,
    });

    if (result.success) {
      return res.status(200).json({
        success: true,
        message: '챌린지 생성 요청에 성공했습니다.',
        data: {
          challengeId: result.data.challengeId,
        },
      });
    } else {
      return res.status(400).json({
        success: false,
        message: '챌린지 생성 요청에 실패했습니다.',
        err: result.err.message,
      });
    }
  },
};

module.exports = {
  challengeController,
};
