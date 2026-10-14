import rateLimit from "express-rate-limit";


export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many login attempts. Please try again after 15 minutes." },
});


export const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many accounts created. Please try again after 1 hour." },
});

const loginAttempts = new Map();

const getLockMinutes = (failures) => {
  if (failures >= 10) return 30;
  if (failures >= 8) return 5;
  if (failures >= 5) return 3;
  return 0;
};

export const loginLockout = (req, res, next) => {
  const email = String(req.body.email || "").toLowerCase();
  const record = loginAttempts.get(email) || { failures: 0, lockUntil: 0 };

  const remainingMs = record.lockUntil - Date.now();
  if (remainingMs > 0) {
    return res.status(429).json({
      message: `Too many failed login attempts. Please try again in ${Math.ceil(remainingMs / 60000)} minute(s).`,
    });
  }

  // Check the result after the controller responds
  res.on("finish", () => {
    if (res.statusCode === 200) {
      loginAttempts.delete(email);
    } else if (res.statusCode === 401) {
      record.failures += 1;
      const minutes = getLockMinutes(record.failures);
      if (minutes) record.lockUntil = Date.now() + minutes * 60 * 1000;
      loginAttempts.set(email, record);
    }
  });

  next();
};
