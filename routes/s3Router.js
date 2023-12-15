const express = require('express');

const multer = require('multer');
const multerS3 = require('multer-s3');
const { S3Client } = require('@aws-sdk/client-s3');

const router = express.Router();

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
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

/**
 * @swagger
 * /api/s3/upload:
 *   post:
 *     summary: S3에 파일 업로드
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       '200':
 *         description: File uploaded successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: '이미지 업로드에 성공했습니다.'
 *               data: 'https://your-s3-bucket-url/file-key'
 *       '400':
 *         description: Bad request or file upload failed
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: '이미지 업로드에 실패했습니다.'
 */
// router.post('/upload', upload.single('file'), (req, res) => {
//   try {
//     const fileUrl = req.file.location;
//     res.status(200).json({
//       success: true,
//       message: '이미지 업로드에 성공했습니다.',
//       data: fileUrl,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(400).json({
//       success: false,
//       message: '이미지 업로드에 실패했습니다.',
//     });
//   }
// });

module.exports = router;
