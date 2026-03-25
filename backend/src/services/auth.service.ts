import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

export const generateAuthTokens = (userId: string) => {
  const accessToken = jwt.sign({ sub: userId }, env.jwt.secret, {
    expiresIn: env.jwt.expiresIn,
  });

  const refreshToken = jwt.sign({ sub: userId }, env.jwt.refreshSecret, {
    expiresIn: env.jwt.refreshExpiresIn,
  });

  return {
    access: {
      token: accessToken,
      expiresIn: env.jwt.expiresIn,
    },
    refresh: {
      token: refreshToken,
      expiresIn: env.jwt.refreshExpiresIn,
    },
  };
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, env.jwt.secret);
};
