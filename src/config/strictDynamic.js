const { validateNonce } = require('./nonceValidator');
const { validateHash } = require('./hashValidator');

const configureStrictDynamic = (app) => {
    app.use((req, res, next) => {
        // Validate nonce
        const validNonce = validateNonce(req, res.locals.nonce);

        // Validate hash
        const validHash = validateHash(req, res.locals.hash);

        // Check if both nonce and hash are valid
        if (validNonce && validHash) {
            // Add 'strict-dynamic' to CSP directive
            res.setHeader('Content-Security-Policy', res.getHeader('Content-Security-Policy') + " 'strict-dynamic'");
        }

        next();
    });
};

module.exports = { configureStrictDynamic };