import bcrypt from 'bcrypt';
import md5 from 'md5';

const SALT_ROUNDS = 12;

export async function hashPassword(password: string) {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export function verifyLegacyMd5(password: string, hash: string) {
  return md5(password) === hash;
}
