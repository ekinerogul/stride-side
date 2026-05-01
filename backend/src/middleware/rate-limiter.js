const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    error: {
      message: "Too many requests, please try again later.",
      status: 429,
    },
  },
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    error: {
      message: "Too many login attempts, please try again later.",
      status: 429,
    },
  },
});

module.exports = { limiter, loginLimiter };
