export function notFound(req, res, next) {
  res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.originalUrl}` });
}

export function errorHandler(err, req, res, next) {
  let status = err.statusCode || 500;
  let message = err.message || 'Internal server error';

  if (err.name === 'CastError') {
    status = 400;
    message = 'Invalid resource ID';
  } else if (err.name === 'ValidationError') {
    status = 400;
    message = 'Database validation failed';
  } else if (err.code === 11000) {
    status = 409;
    message = 'A record with this value already exists';
  }

  if (process.env.NODE_ENV === 'production' && status >= 500) {
    message = 'Internal server error';
  }

  if (status >= 500) console.error(err);
  res.status(status).json({ success: false, message, ...(err.details ? { details: err.details } : {}) });
}
