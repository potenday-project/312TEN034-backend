const { challengeService } = require('../services/challengeService');
const { alarmService } = require('../services/alarmService');
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
      const memberId = getUserIdFromJwt(req.headers.authorization);
      const { challengeId } = req.body;
      const authenticateImageUrl = resultSubmitImage.data;

      // 챌린지 인증 테이블 인설트 하기 전,
      // 제일 최근 인증이 수락되지 않은 인증(Null)인가?
      const findNullApproved = await challengeService.findNullApproved({ memberId, challengeId });

      const [{ is_authenticate: isAuthenticate, participation_count: participationCount }] = findNullApproved.data;

      console.log(isAuthenticate, participationCount);

      // 1. 아직 승인되지 않은 인증이 있으면
      if (isAuthenticate === null) {
        return res.status(400).json({
          success: false,
          message: '아직 승인되지 않은 인증이 있습니다.',
        });
      }

      // 2. 제일 최근 인증이 거절된 인증이면
      if (isAuthenticate === 0) {
        // 새로운 인증 로우를 만들어서 is_authenticate를 NULL(수락/거절도 아님)으로 넣어준다.
        const submitResult = await challengeService.createChallengeCertification({
          memberId,
          challengeId,
          authenticateImageUrl,
          is_authenticate: null,
          participationCount,
        });

        // TODO: 재인증 요청 알람을 상대방에게 전송한다.

        if (submitResult.success) {
          // 재인증 요청이므로 마지막 인증 요청의 participation_count로 그대로 만들고, is_authenticate를 NULL로 넣고 생성한다.
          return res.status(200).json({
            success: true,
            message: '같은 회차에 새로운 인증 데이터를 만들었습니다.',
            data: { authenticateImageUrl, submitResult },
          });
        } else {
          return res.status(400).json({
            success: false,
            message: '이미지 업로드에 성공, 챌린지 인증 쿼리문 실패했습니다',
            data: { authenticateImageUrl },
            err: resultSubmitImage.err,
          });
        }
      }

      if (isAuthenticate === 1) {
        // 3. 제일 최근 인증이 승인된 인증이면?
        const submitResult = await challengeService.createChallengeCertification({
          memberId,
          challengeId,
          authenticateImageUrl,
          is_authenticate: null,
          participationCount: participationCount + 1,
        });

        // TODO: 새로운 인증 요청 알람을 상대방에게 전송한다.

        if (submitResult.success) {
          // 새로운 인증 요청이므로 participation_count를 1 증가시키고, is_authenticate를 NULL로 넣고 생성한다.
          return res.status(200).json({
            success: true,
            message: '새로운 회차에 새로운 인증 데이터를 만들었습니다.',
            data: { authenticateImageUrl, submitResult },
          });
        } else {
          return res.status(400).json({
            success: false,
            message: '이미지 업로드에 성공, 챌린지 인증 쿼리문 실패했습니다',
            data: { authenticateImageUrl },
            err: resultSubmitImage.err,
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

  getChallenges: async (req, res) => {
    const memberId = getUserIdFromJwt(req.headers.authorization);

    const result = await challengeService.getChallenges(memberId);

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
};

module.exports = {
  challengeController,
};
