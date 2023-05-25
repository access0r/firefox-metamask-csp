const { createHash } = require('crypto');

const generateHash = (directive, value) => {
    const hash = createHash('sha256').update(value).digest('base64');
    return `${directive} 'sha256-${hash}'`;
};

const validateHash = (req, hash) => {
    // Validate the hash based on the request and provided hash
    // Implement your validation logic here
    return true; // Return true for demonstration purposes
};

module.exports = { generateHash, validateHash };