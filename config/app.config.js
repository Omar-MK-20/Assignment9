import dotenv from 'dotenv';
import path from 'node:path';


dotenv.config({ path: path.resolve("./config/.env.dev") });

export const SEVER_PORT = process.env.SEVER_PORT;
export const DB_URI = process.env.DB_URI;