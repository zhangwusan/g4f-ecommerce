import * as dotenv from 'dotenv';
dotenv.config();
export const jwtConstants = {
    secret: process.env.JWT_SECRET || 'secretKey',
    expires_in: process.env.JWT_EXPIRES_IN || '1h',
    refresh_secret: process.env.JWT_REFRESH_SECRET || 'refresh secret',
    refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN || '7d'
}