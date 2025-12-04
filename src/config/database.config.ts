import { registerAs } from "@nestjs/config";
import Joi from "joi";
type DatabaseType = 'mysql' | 'postgres';

export default registerAs('database', () => ({
    host: process.env.DB_HOST,
    type: (process.env.DB_TYPE as DatabaseType) || 'postgres',
    port: parseInt(process.env.DB_PORT ?? '5432', 10),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    synchronize: process.env.NODE_ENV !== 'production',
    database: process.env.DB_DATABASE,
}));

export const databaseValidationSchema = Joi.object({
    DB_HOST: Joi.string().required(),
    DB_TYPE: Joi.string().valid('mysql', 'postgres').required(),
    DB_PORT: Joi.number().default(5432),
    DB_USERNAME: Joi.string().required(),
    DB_PASSWORD: Joi.string().required(),
    DB_DATABASE: Joi.string().required(),
});
