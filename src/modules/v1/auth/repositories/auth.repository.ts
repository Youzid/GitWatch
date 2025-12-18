import { Inject, Injectable } from '@nestjs/common';
import { Kysely } from 'kysely';
import { DB } from '../../../../infra/database/database.types';

@Injectable()
export class AuthRepository {
    constructor(
        @Inject("DATABASE") private readonly db :Kysely<DB>,
    ) { }

   

}
