import type { Kysely } from 'kysely'

// `any` is required here since migrations should be frozen in time. alternatively, keep a "snapshot" db interface.
export async function up(db: Kysely<any>): Promise<void> {
    await db.schema
    .alterTable('files')
    .addColumn('parent_id', 'integer', (col) => 
      col.references('files.id').onDelete('set null')
    )
    .execute()
}

// `any` is required here since migrations should be frozen in time. alternatively, keep a "snapshot" db interface.
export async function down(db: Kysely<any>): Promise<void> {
    await db.schema
    .alterTable('files')
    .dropColumn('parent_id')
    .execute()
}
