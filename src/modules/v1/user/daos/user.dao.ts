import { Inject, Injectable } from '@nestjs/common';
import { Kysely } from 'kysely';
import { DB } from '../../../../infra/database/database.types';

@Injectable()
export class UserDao {
  constructor(@Inject("DATABASE") private readonly db: Kysely<DB>) {}


  async findAll() {
    return await this.db.selectFrom('users').selectAll().executeTakeFirst();
  }

//  
}