import { Inject, Injectable } from '@nestjs/common';
import { Kysely } from 'kysely';
import { DB } from '../../../../infra/database/database.types';

@Injectable()
export class AuthRepository {
    constructor(
        @Inject("DATABASE") private readonly db: Kysely<DB>,
    ) { }

    async createEmailVerificationToken({ user_id, token_hash, expires_at }) {
        return await this.db.insertInto("email_verification_tokens").values({
            user_id,
            token_hash,
            expires_at,
            created_at: new Date(),
        }).execute()
    }

    async findValid() {
        return await this.db.selectFrom("email_verification_tokens").selectAll().where('email_verification_tokens.expires_at', ">", new Date()).execute()
    }

    async verifyEmailTransaction(user_id,token_id, ) {
        return await this.db.transaction().execute(async (trx) => {
            const user = await trx
                .updateTable('users')
                .set({ is_active: true })
                .where('users.id', "=", user_id)
                .returningAll()
                .executeTakeFirstOrThrow();

            await trx
                .deleteFrom('email_verification_tokens')
                .where('email_verification_tokens.user_id', "=", user_id)
                .execute();

            return user;
        });

    }
    async saveRefreshToken({ user_id, refreshTokenHash, expires_at }) {
        return await this.db.insertInto("refresh_tokens").values({
            token_hash: refreshTokenHash,
            user_id:user_id,
            expires_at,
            created_at: new Date()
        }).execute()

    }
}
