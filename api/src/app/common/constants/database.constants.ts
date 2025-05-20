import * as dotenv from 'dotenv';
dotenv.config();
export const databaseConstants = {
    connection: process.env.DB_CONNECTION || 'postgres',
    host: process.env.DB_HOST || 'postgres',
    port: process.env.DB_PORT || 'localhost',
    username: process.env.DB_USERNAME || 'admin',
    password: process.env.DB_PASSWORD || 'admin',
    database: process.env.DB_DATABASE || 'postgres_db'
}