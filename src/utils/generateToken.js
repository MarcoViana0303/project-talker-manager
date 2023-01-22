const { randomBytes } = require('crypto');

const generateToken = () => {
    const token = randomBytes(8).toString('hex');
  return token;
};

module.exports = { generateToken };