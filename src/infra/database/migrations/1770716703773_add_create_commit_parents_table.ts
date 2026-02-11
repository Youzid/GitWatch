import { sql, type Kysely } from 'kysely'

// `any` is required here since migrations should be frozen in time. alternatively, keep a "snapshot" db interface.
export async function up(db: Kysely<any>): Promise<void> {
	await db.schema
    .createTable('commit_parents')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('commit_id', 'integer', (col) => col.notNull().references('commits.id').onDelete('cascade'))
    .addColumn('parent_id', 'integer',(col) => col.notNull().references('commits.id').onDelete('cascade'))
    .addColumn('created_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`now()`))
    .addColumn('updated_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`now()`))
    .addUniqueConstraint('commit_commitId_unique', ['commit_id', 'parent_id'])
    .execute()
}

// `any` is required here since migrations should be frozen in time. alternatively, keep a "snapshot" db interface.
export async function down(db: Kysely<any>): Promise<void> {
	await db.schema
    .dropTable('commit_parents')
    .execute()
}
