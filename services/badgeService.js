const { badgeModel } = require('../models/badgeModel');

const badgeService = {
  getBadges: async ({ memberId }) => {
    try {
      const result = await badgeModel.getBadges({
        memberId,
      });

      return {
        success: true,
        data: {
          badges: result,
        },
      };
    } catch (err) {
      return {
        success: false,
        err,
      };
    }
  },
};

module.exports = {
  badgeService,
};
