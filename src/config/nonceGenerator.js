const { randomBytes } = require('crypto');

const generateNonce = () => {
    const nonceBytes = randomBytes(16);
    return Buffer.from(nonceBytes).toString('base64');
};

module.exports = { generateNonce };