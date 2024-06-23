import slowDown from 'express-slow-down';

export const globalSlowDown = slowDown({
  windowMs: 10 * 60 * 1000,
  delayAfter: 100,
  delayMs: () => 500,
});

export const signUpSlowDown = slowDown({
  windowMs: 60 * 60 * 1000,
  delayAfter: 2,
  delayMs: () => 1000,
});
