import type { Kysely } from 'kysely'
import { sql } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
	await db.schema
		.createType('repo_provider')
		.asEnum(['github', 'gitlab'])
		.execute()

	await db.schema.alterTable('repositories')
    .dropColumn('owner_id')
    .dropColumn('provider_repo_id')
    .addColumn('repo_provider', sql`repo_provider`, (col) => col.notNull())
    .addColumn('repo_owner_name', 'varchar(255)', (col) => col.notNull())
    .addColumn('repo_token_encrypted', 'text', (col) => col.notNull())
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
	await db.schema.alterTable('repositories')
    .dropColumn('repo_token_encrypted')
    .dropColumn('repo_owner_name')
    .dropColumn('repo_provider')
    .addColumn('owner_id', 'integer', (col) => 
      col.references('users.id')
    )
    .addColumn('provider_repo_id', 'varchar(255)', (col) => col.unique())
    .execute()

	await db.schema.dropType('repo_provider').ifExists().execute()
}
