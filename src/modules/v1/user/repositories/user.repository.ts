import { Inject, Injectable } from '@nestjs/common';
import { Kysely } from 'kysely';
import { DB } from '../../../../infra/database/database.types';

@Injectable()
export class UserRepository {
  constructor(@Inject("DATABASE") private readonly db: Kysely<DB>) {}


    async findAll() {
        return await this.db.selectFrom('users').selectAll().execute();
    }
    async findOneByEmail(email: string) {
        console.log(email)
        return await this.db.selectFrom('users').select(["id", "email", "password", 'username', "created_at", "access_token"]).where("email", '=', email).executeTakeFirstOrThrow()
    }

}