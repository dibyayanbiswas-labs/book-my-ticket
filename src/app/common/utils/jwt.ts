import jwt from 'jsonwebtoken';
import type {Secret} from 'jsonwebtoken';
import type { StringValue } from 'ms';

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET_KEY || "fallback_secret";
const JWT_ACCESS_EXPIRY = process.env.JWT_ACCESS_EXPIRES_IN as StringValue || "15m";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET_KEY || "fallback_secret";
const JWT_REFRESH_EXPIRY = process.env.JWT_REFRESH_EXPIRES_IN as StringValue || "7d";

const generateAccessToken = (userId: number, email: string): Secret => {
  return jwt.sign({ userId, email }, JWT_ACCESS_SECRET, { expiresIn: JWT_ACCESS_EXPIRY });
}

const generateRefreshToken = (userId: number) => {
    return jwt.sign({userId}, JWT_REFRESH_SECRET, {
        expiresIn: JWT_REFRESH_EXPIRY
    })
}

const verifyAccessToken = (token: string) => {
    return jwt.verify(token, JWT_ACCESS_SECRET);
}

const verifyRefreshToken = (token: string) => {
    return jwt.verify(token, JWT_REFRESH_SECRET);
}


export {
    generateAccessToken,
    generateRefreshToken,
    verifyAccessToken,
    verifyRefreshToken
}



