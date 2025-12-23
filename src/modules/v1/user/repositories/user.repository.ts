import { CreateUserDto } from './../dtos/create-user.dto';
import { Inject, Injectable } from '@nestjs/common';
import { Kysely } from 'kysely';
import { DB } from '../../../../infra/database/database.types';

@Injectable()
export class UserRepository {
    constructor(@Inject("DATABASE") private readonly db: Kysely<DB>) { }


    async findAll() {
        return await this.db.selectFrom('users').selectAll().execute();
    }
    async findOneByEmail(email: string) {
        return await this.db.selectFrom('users').select(["id", "email", "password", 'username', "created_at"]).where("email", '=', email).executeTakeFirst();
    }

    async create(createUserDto: CreateUserDto) {
        return await this.db.insertInto("users").values({
            email: createUserDto.email,
            password: createUserDto.password,
            username: createUserDto.username,
            created_at: new Date(),
            is_active: createUserDto.isActive,
        }).returningAll()
            .executeTakeFirstOrThrow();

    }

}