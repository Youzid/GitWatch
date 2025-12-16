import { Module } from '@nestjs/common';
import { Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';
import { DB } from './database.types';



const databaseProvider = {
  provide: 'DATABASE',
  useValue: new Kysely<DB>({
    dialect: new PostgresDialect({
      pool: new Pool({
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        database: process.env.DB_DATABASE,
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
      }),
    }),
    
  }),
};

@Module({
  providers: [databaseProvider],
  exports: [databaseProvider],
})
export class DatabaseModule {}