const jwt = require('jsonwebtoken');

function extractJwtPayload(token) {
  try {
    const decoded = jwt.decode(token, { complete: true });
    return decoded.payload;
  } catch (error) {
    console.error('JWT payload extraction error:', error.message);
    return null;
  }
}

function getUserIdFromJwt(token) {
  const payload = extractJwtPayload(token);
  return payload.id;
}

module.exports = {
  extractJwtPayload,
  getUserIdFromJwt,
};
