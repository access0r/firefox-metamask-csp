// responseModule.js

function setCspHeader(res, cspConfig) {
    const cspHeaderValue = Object.entries(cspConfig.directives)
        .map(([directive, values]) => `${directive} ${values.join(' ')}`)
        .join('; ');

    res.setHeader('Content-Security-Policy', cspHeaderValue);
}

function setRateLimitHeaders(res, limit, remaining, reset) {
    res.setHeader('X-RateLimit-Limit', limit);
    res.setHeader('X-RateLimit-Remaining', remaining);
    res.setHeader('X-RateLimit-Reset', reset);
}

function sendErrorResponse(res, statusCode, message) {
    res.status(statusCode).json({ error: message });
}

function handleError(err, req, res) {
    console.error(err);
    sendErrorResponse(res, 500, 'Internal Server Error');
}

module.exports = {
    setCspHeader,
    setRateLimitHeaders,
    sendErrorResponse,
    handleError,
};