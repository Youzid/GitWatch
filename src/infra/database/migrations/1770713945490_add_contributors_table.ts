import { sql, type Kysely } from 'kysely'

// `any` is required here since migrations should be frozen in time. alternatively, keep a "snapshot" db interface.
export async function up(db: Kysely<any>): Promise<void> {
	await db.schema
    .createTable('contributors')
    .addColumn("id",'serial',(col)=> col.primaryKey())
    .addColumn('repository_id', 'integer', (col) => col.notNull().references('repositories.id').onDelete('cascade'))
    .addColumn('email', 'varchar(255)', (col) => col.notNull())
    .addColumn('created_at', 'timestamp', (col) => col.defaultTo(sql`now()`))
    .addColumn('updated_at', 'timestamp', (col) => col.defaultTo(sql`now()`))
    .addUniqueConstraint('contributors_repository_email_unique', ['repository_id', 'email'])
    .execute()
}


// `any` is required here since migrations should be frozen in time. alternatively, keep a "snapshot" db interface.
export async function down(db: Kysely<any>): Promise<void> {
	await db.schema
    .dropTable('contributors')
    .execute()
}
