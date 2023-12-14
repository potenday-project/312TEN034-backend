const { challengeModel } = require('../models/challengeModel');

const challengeService = {
  createChallenge: async ({ name, category, authenticationMethod, reward, targetCount }) => {
    console.log(name, category, authenticationMethod, reward, targetCount);

    try {
      const result = await challengeModel.createChallenge({
        name,
        category,
        authenticationMethod,
        reward,
        targetCount,
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
};

module.exports = {
  challengeService,
};
