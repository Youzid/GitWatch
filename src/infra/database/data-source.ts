import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
import { SeederOptions } from 'typeorm-extension';
import InitSeeder from './seeding/seeds/init.seeder';

config();

export const dataSourceOptions: DataSourceOptions & SeederOptions = {
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME || 'user',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_DATABASE || 'gitscope',
    entities: ['src/**/*.entity{.ts,.js}'],
    migrations: ['src/infra/database/migrations/*{.ts,.js}'],
    migrationsTableName: 'migrations',
    seeds: [InitSeeder],
};

export const AppDataSource = new DataSource(dataSourceOptions);