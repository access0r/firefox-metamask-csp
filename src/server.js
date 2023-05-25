const express = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const { generateNonce, validateNonce } = require('./nonceValidator');
const { generateHash, validateHash } = require('./hashValidator');
const { setCspHeader, setRateLimitHeaders, sendErrorResponse, handleError } = require('./responseModule');

const app = express();

// Enable rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
});

// Helmet middleware for security headers
app.use(helmet());

// Apply rate limiting to all requests
app.use(limiter);

// Custom middleware to handle MetaMask usage and inject client-side script
app.use((req, res, next) => {
    // Set a custom header to indicate if MetaMask is being used
    res.setHeader('X-MetaMask-Usage', 'unknown');

    // Generate nonce and hash for CSP
    const nonce = generateNonce();
    const scriptContent = `/* Your client-side script content here */`;
    const hash = generateHash(scriptContent);

    // Configure CSP with nonce and hash
    const cspConfig = getCSP(nonce, scriptContent);
    setCspHeader(res, cspConfig);

    // Set nonce in res.locals for later validation
    res.locals.nonce = nonce;

    // Set a flag to indicate if MetaMask usage is determined
    let isMetaMaskDetermined = false;

    // Execute JavaScript code on the client side to determine MetaMask usage
    const clientScript = `
    if (typeof window !== 'undefined' && window.ethereum) {
      '${req.path}' !== '/metamask-check' && fetch('/metamask-check');
      document.cookie = 'metamask=true;path=/';
    }
  `;

    // Inject the client-side script
    const html = `
    <html>
      <head>
        <script nonce="${nonce}">${clientScript}</script>
      </head>
      <body></body>
    </html>
  `;

    // Respond with the injected HTML
    res.send(html);

    // Set a timeout to allow the client-side script to execute
    setTimeout(() => {
        // Check if the nonce and hash are valid
        const validNonce = validateNonce(req, res.locals.nonce);
        const validHash = validateHash(scriptContent, req.headers['content-security-policy'], hash);

        if (validNonce && validHash) {
            // Check if the 'metamask' cookie is set
            if (req.cookies && req.cookies.metamask) {
                res.setHeader('X-MetaMask-Usage', 'true');
            } else {
                res.setHeader('X-MetaMask-Usage', 'false');
            }
        }

        next();
    }, 200);
});

// Route for checking MetaMask usage
app.get('/metamask-check', (req, res) => {
    // Perform any additional checks or actions here
    res.sendStatus(200);
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    sendErrorResponse(res, 500, 'Internal Server Error');
});

// Start the server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
``
`