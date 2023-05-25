//

const { createHash } = require('crypto');

function generateNonce() {
    const nonceLength = 16;
    const buffer = Buffer.alloc(nonceLength);
    return buffer.toString('base64');
}

function generateHash(scriptContent) {
    const hash = createHash('sha256');
    hash.update(scriptContent);
    return `'sha256-${hash.digest('base64')}'`;
}

function validateNonce(nonce, expectedNonce) {
    return nonce === expectedNonce;
}

function validateHash(scriptContent, hash, expectedHash) {
    const generatedHash = generateHash(scriptContent);
    return hash === expectedHash && generatedHash === expectedHash;
}

function configureCsp(nonce, scriptContent) {
    const nonceDirective = `'nonce-${nonce}'`;
    const hashDirective = generateHash(scriptContent);

    const cspConfig = {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", nonceDirective, hashDirective, "'strict-dynamic'"],
        },
    };

    return cspConfig;
}

module.exports = {
    generateNonce,
    generateHash,
    validateNonce,
    validateHash,
    configureCsp,
};
