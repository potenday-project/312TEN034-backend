const { challengeModel } = require('../models/challengeModel');
const { challengeParticipantModel } = require('../models/challengeParticipantModel');
const { challengeCertificationModel } = require('../models/challengeCertificationModel');
const { memberModel } = require('../models/memberModel');

const challengeService = {
  createChallenge: async ({ userId, name, category, authenticationMethod, reward, targetCount }) => {
    try {
      const result = await challengeModel.createChallenge({
        name,
        category,
        authenticationMethod,
        reward,
        targetCount,
      });

      await challengeParticipantModel.createChallengeParticipant({
        memberId: userId,
        challengeId: result.insertId,
        role: 'OWNER',
      });

      return {
        success: true,
        data: {
          challengeId: result.insertId,
        },
      };
    } catch (error) {
      return {
        success: false,
        err: error,
      };
    }
  },
  approveChallenge: async ({ memberId, challengeId }) => {
    try {
      const result = await challengeModel.approveChallenge({
        memberId,
        challengeId,
      });

      await challengeModel.startChallenge({
        challengeId,
      });

      return {
        success: true,
        data: {
          challengeId: result.insertId,
        },
      };
    } catch (error) {
      return {
        success: false,
        err: error,
      };
    }
  },
  getUpcomingChallenge: async ({ challengeId }) => {
    try {
      const result = await challengeModel.getUpcomingChallenge({
        challengeId,
      });

      return {
        success: true,
        data: {
          challenge: result,
        },
      };
    } catch (error) {
      return {
        success: false,
        err: error,
      };
    }
  },
  getInProgressChallenge: async ({ challengeId }) => {
    try {
      const result = await memberModel.getChallengeProgressInfo({
        challengeId,
      });

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        err: error,
      };
    }
  },
};

module.exports = {
  challengeService,
};
