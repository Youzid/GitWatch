import type { Kysely } from 'kysely'

// `any` is required here since migrations should be frozen in time. alternatively, keep a "snapshot" db interface.
export async function up(db: Kysely<any>): Promise<void> {
	await db.schema
    .alterTable('commits')
    .dropColumn('author_email')
    .addColumn("contributor_id", "integer", (col) => 
      col.references("contributors.id").onDelete('set null')
    )
    .execute()
}

// `any` is required here since migrations should be frozen in time. alternatively, keep a "snapshot" db interface.
export async function down(db: Kysely<any>): Promise<void> {
	await db.schema
    .alterTable('commits')
    .dropColumn('contributor_id')
    .dropColumn('parent_shas')
    .addColumn('author_email', 'varchar(255)', (col) =>
      col.references('users.email')
    )
    .execute()
}
