const errorHandler = (err, req, res, next) => {
    // Handle errors and send an appropriate response
    res.status(500).json({ error: 'Internal Server Error' });
};

module.exports = errorHandler;