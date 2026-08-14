import rateLimit from "express-rate-limit";

// Auth routes (login, registration, activation, social auth) get a much
// tighter limit — these are exactly what someone would hammer to brute-force
// a password or spam-create accounts.
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many attempts. Please try again in 15 minutes.",
  },
});

// A much looser limit applied to every request as a baseline safety net
// against general abuse/scraping, without getting in the way of normal use.
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests. Please slow down.",
  },
});
