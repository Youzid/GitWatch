import { UserTable } from './tables';

export interface Database {
  users: UserTable;
}


export type DB = Database;
