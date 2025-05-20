import * as dotenv from 'dotenv';
dotenv.config();
export const redisConstants = {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
}