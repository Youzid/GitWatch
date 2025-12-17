import { Module } from '@nestjs/common';
import { Kysely, PostgresDialect ,LogEvent} from 'kysely';
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
     log(event: LogEvent): void {
      if (event.level === 'query') {
        console.log('SQL:', event.query.sql);
        console.log('Parameters:', event.query.parameters);
        console.log('Duration:', event.queryDurationMillis.toFixed(2), 'ms');
      }
      
      if (event.level === 'error') {
        console.error('SQL:', event.query.sql);
        console.error('Parameters:', event.query.parameters);
        console.error('Error:', event.error);
      }
    },
  }),
};

@Module({
  providers: [databaseProvider],
  exports: [databaseProvider],
})
export class DatabaseModule {}