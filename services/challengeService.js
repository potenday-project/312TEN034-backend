const { challengeModel } = require('../models/challengeModel');
const { challengeParticipantModel } = require('../models/challengeParticipantModel');
const { challengeCertificationModel } = require('../models/challengeCertificationModel');
const { memberModel } = require('../models/memberModel');
const { S3Client } = require('@aws-sdk/clients/s3');
const multer = require('multer');
const multerS3 = require('multer-s3');

const s3 = new S3Client({
  region: 'ap-northeast-2',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'dodals3',
    key: function (req, file, cb) {
      cb(null, Date.now().toString());
    },
  }),
});

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

  submitImage: async (req, res) => {
    try {
      // 이미지 업로드 미들웨어를 사용
      //s3, upload 정보는 최상단에 선언
      upload.single('image')(req, res, (err) => {
        if (err) {
          return res.status(500).json({ success: false, err: err });
        }

        const IMG_URL = req.file.location;
        return res.json({ success: true, data: IMG_URL });
      });
    } catch (err) {
      return res.status(500).json({ success: false, err: err });
    }
  },
};

module.exports = {
  challengeService,
};
