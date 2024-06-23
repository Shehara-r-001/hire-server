import { rateLimit } from 'express-rate-limit';
import * as requestIp from 'request-ip';

const getClientIpOrDefault = (req: any): string => {
  const ip = requestIp.getClientIp(req);
  return ip ? ip : 'unknown';
};

export const gloabalRequestLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 200,
  message: 'Too many requests from this IP. Please try again later',
  // keyGenerator: req => getClientIpOrDefault(req)
});

export const signUpRequestLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: 'Too many requests from this IP. Please try again later',
  //   keyGenerator: (req) => getClientIpOrDefault(req)
});
