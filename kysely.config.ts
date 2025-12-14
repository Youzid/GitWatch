import { defineConfig } from 'kysely-ctl';
import { PostgresDialect } from 'kysely';
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config(); 

export default defineConfig({
  dialect: new PostgresDialect({
    pool: new Pool({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      database: process.env.DB_DATABASE,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
    }),
  }),
  migrations: {
    migrationFolder: 'src/infra/database/migrations',
  },
});