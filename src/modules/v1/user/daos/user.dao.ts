import { Inject, Injectable } from '@nestjs/common';
import { Kysely } from 'kysely';
import type { DB } from '../../../../infra/database/interface/db';

@Injectable()
export class UserDao {
  constructor(@Inject("DATABASE") private readonly db: Kysely<DB>) {}


  async findAll() {
    return await this.db.selectFrom('users').selectAll().executeTakeFirst();
  }

//  
}