const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

require('dotenv').config();

const options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      version: '1.0.0',
      title: 'dodalAPI',
      description: '프로젝트 설명 Node.js Swaager swagger-jsdoc 방식 RestFul API 클라이언트 UI',
    },
    servers: [
      {
        url: process.env.SERVER_URL, // 요청 URL
      },
    ],
  },
  apis: ['./routes/*.js'], //Swagger 파일 연동
};
const specs = swaggerJsdoc(options);

module.exports = { swaggerUi, specs };
