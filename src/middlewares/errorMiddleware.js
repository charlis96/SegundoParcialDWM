function errorHandler(err, req, res, next) {

    console.error(err);

    const statusCode = err.statusCode || 500;

    res.status(statusCode).json({
        error: {
            message: err.message,
            status: statusCode,
            stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack
        }
    });
}

export default errorHandler;