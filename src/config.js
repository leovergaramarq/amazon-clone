import { config } from 'dotenv';

config();

// app
export const PORT = process.env.PORT || 3000;
export const NODE_ENV = process.env.NODE_ENV || 'development';

// db
export const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/your-database';

// jwt
export const JWT_SECRET = process.env.JWT_SECRET || 'your-secret';
