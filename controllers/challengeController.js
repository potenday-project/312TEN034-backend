const { challengeService } = require('../services/challengeService');
const { getUserIdFromJwt } = require('../utils/jwt');

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
  approveChallenge: async (req, res) => {
    const { challengeId } = req.body;

    const result = await challengeService.approveChallenge({
      memberId: getUserIdFromJwt(req.headers.authorization),
      challengeId,
    });

    if (result.success) {
      return res.status(200).json({
        success: true,
        message: '챌린지 승인 요청에 성공했습니다.',
      });
    } else {
      return res.status(400).json({
        success: false,
        message: '챌린지 승인 요청에 실패했습니다.',
        err: result.err.message,
      });
    }
  },
  getUpcomingChallenge: async (req, res) => {
    const { id: challengeId } = req.params;

    const result = await challengeService.getUpcomingChallenge({
      challengeId,
    });

    if (result.success) {
      return res.status(200).json({
        success: true,
        message: '챌린지 조회 요청에 성공했습니다.',
        data: {
          challenge: result.data.challenge,
        },
      });
    } else {
      return res.status(400).json({
        success: false,
        message: '챌린지 조회 요청에 실패했습니다.',
        err: result.err.message,
      });
    }
  },
  getInProgressChallenge: async (req, res) => {
    const { id: challengeId } = req.params;

    const result = await challengeService.getInProgressChallenge({
      challengeId,
    });

    if (result.success) {
      return res.status(200).json({
        success: true,
        message: '챌린지 조회 요청에 성공했습니다.',
        data: result.data,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: '챌린지 조회 요청에 실패했습니다.',
        err: result.err.message,
      });
    }
  },
  submitImage: async (req, res) => {
    const result = await challengeService.submitImage(req, res);
    if (result.success) {
      return res.status(200).json({
        success: true,
        message: '이미지 업로드에 성공했습니다.',
        data: {
          IMG_URL: result.data,
        },
      });
    } else {
      return res.status(400).json({
        success: false,
        message: '이미지 업로드에 실패했습니다.',
        err: result.err,
      });
    }
  },
};

module.exports = {
  challengeController,
};
