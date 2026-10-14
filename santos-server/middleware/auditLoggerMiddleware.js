import Log from "../Models/logModel.js";

const writeLog = (level) => async (message, metadata = {}) => {
  try {
    await Log.create({ level, message, metadata });
  } catch (error) {
    console.error(`Failed to write ${level} log:`, error);
  }
};

export const logger = {
  info: writeLog("info"),
  warn: writeLog("warn"),
  error: writeLog("error"),
};

export const auditLoggerMiddleware = (req, res, next) => {
  const startTime = Date.now();

  const originalSend = res.send;
  res.send = function (data) {
    const statusCode = res.statusCode;
    const metadata = {
      method: req.method,
      url: req.originalUrl,
      statusCode,
      ip: req.ip,
      userId: req.user?.id || req.user?._id || null,
      userAgent: req.get("user-agent"),
      responseTime: `${Date.now() - startTime}ms`,
    };

    const message = `${req.method} ${req.originalUrl} ${statusCode}`;

    if (statusCode >= 500) logger.error(message, metadata);
    else if (statusCode >= 400) logger.warn(message, metadata);
    else logger.info(message, metadata);

    return originalSend.call(this, data);
  };

  next();
};
