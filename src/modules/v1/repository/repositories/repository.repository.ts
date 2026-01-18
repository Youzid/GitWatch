import { Inject, Injectable } from '@nestjs/common';
import { Insertable, Kysely } from 'kysely';
import { DB } from '../../../../infra/database/database.types';


@Injectable()
export class RepositoryRepository {
    constructor(@Inject("DATABASE") private readonly db: Kysely<DB>) { }

    async create(data: Insertable<DB['repositories']>, userId: number) {
        return await this.db.transaction().execute(async (trx) => {
            const repository = await trx
                .insertInto('repositories')
                .values(data)
                .returningAll()
                .executeTakeFirstOrThrow();

            await trx
                .insertInto('repo_user')
                .values({
                    user_id: userId,
                    repository_id: repository.id,
                    role: 'OWNER',
                })
                .execute();

            return repository;
        });
    }

     async findByName(name:string, userId: number) {
        return await this.db
        .selectFrom('repositories')
        .selectAll().where('name','=',name)
        .innerJoin('repo_user',"repo_user.repository_id",'repositories.id')
        .where('repo_user.user_id','=',userId)
        .executeTakeFirst()
       
    }

    async findAll(userId: number) {
         return await this.db
      .selectFrom('repositories')
      .selectAll()
      .innerJoin('repo_user', 'repo_user.repository_id', 'repositories.id')
      .where('repo_user.user_id', '=', userId)
      .select([
        'repositories.id',
        'repositories.name',
        'repositories.is_active',
        'repositories.default_branch',
        'repositories.created_at',
        'repositories.updated_at',
        'repositories.repo_provider',
        'repositories.repo_owner_name',
      ])
      .execute();
  }

  async findById(id: number, userId: number) {
    return await this.db
      .selectFrom('repositories')
      .selectAll()
      .innerJoin('repo_user', 'repo_user.repository_id', 'repositories.id')
      .where('repositories.id', '=', id)
      .where('repo_user.user_id', '=', userId)
      .select([
        'repositories.id',
        'repositories.name',
        'repositories.is_active',
        'repositories.default_branch',
        'repositories.created_at',
        'repositories.updated_at',
        'repositories.repo_provider',
        'repositories.repo_owner_name',
      ])
      .executeTakeFirst();
  }
}
