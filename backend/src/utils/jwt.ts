import jwt from 'jsonwebtoken';

const accessSecret = process.env.JWT_SECRET ?? 'dev_access_secret';
const refreshSecret = process.env.JWT_REFRESH_SECRET ?? 'dev_refresh_secret';

export function signAccessToken(payload: object, expiresIn = '15m') {
  return jwt.sign(payload, accessSecret, { expiresIn });
}

export function signRefreshToken(payload: object, expiresIn = '7d') {
  return jwt.sign(payload, refreshSecret, { expiresIn });
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, accessSecret);
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, refreshSecret);
}
