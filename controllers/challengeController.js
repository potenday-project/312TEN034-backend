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
    // 이미지 업로드 시도
    const resultSubmitImage = await challengeService.submitImage(req, res);
    if (resultSubmitImage.success) {
      // 이미지 업로드 성공시
      const memberId = await challengeService.approveChallenge({
        // 이미지 업로드 성공시 챌린지 인증 테이블 인설트시도
        memberId: getUserIdFromJwt(req.headers.authorization),
      });
      const { challengeId } = req.body;
      const IMG_URL = resultSubmitImage.data;

      // 챌린지 인증 테이블 인설트 하기 전,
      // 제일 최근 인증이 수락되지 않은 인증(Null)인가?
      const findNullApproved = await challengeService.findNullApproved({ memberId, challengeId });
      if (findNullApproved.data[0].result === NULL) {
        return res.status(400).json({
          success: false,
          message: 'NULl인 인증이 있습니다.',
        });
      } else {
        // 제일 최근 인증이 Null이 아니라면(True or False)
        if (findNullApproved.data[0].result == false) {
          // 제일 최근 인증이 False라면?
          const submitResult = await challengeService.submitChallenge({
            memberId,
            challengeId,
            IMG_URL,
            is_authenticate: 0,
          });
          if (submitResult.success) {
            return res.status(200).json({
              success: true,
              message: '이미지 업로드에 성공, 챌린지 인증 쿼리문 성공했습니다',
              data: { IMG_URL, submitResult },
            });
          } else {
            return res.status(400).json({
              success: false,
              message: '이미지 업로드에 성공, 챌린지 인증 쿼리문 실패했습니다',
              data: { IMG_URL },
              err: resultSubmitImage.err,
            });
          }
        } else {
          //제일 최근 인증이 True라면?
          const submitResult = await challengeService.submitChallenge({
            memberId,
            challengeId,
            IMG_URL,
            is_authenticate: 1,
          });
          return res.status(200).json({
            success: true,
            message: '이미지 업로드에 성공, 챌린지 인증 쿼리문 성공했습니다',
            data: { IMG_URL, submitResult },
          });
        }
      }
    } else {
      return res.status(400).json({
        success: false,
        message: '이미지 업로드에 실패했습니다.',
        err: resultSubmitImage.err,
      });
    }
  },
};

module.exports = {
  challengeController,
};
