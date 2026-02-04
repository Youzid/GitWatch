import { sql, type Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
    await db.schema
    .createType('file_types')
    .asEnum(['BLOB', 'TREE'])
    .execute()

    await db.schema
        .createTable('files')
        .addColumn('id', 'serial', (col) => col.primaryKey())
        .addColumn('repository_id', 'integer', (col) =>
            col.references('repositories.id').notNull().onDelete('cascade')
        )
        .addColumn('path', 'text', (col) => col.notNull())
        .addColumn('size', 'integer')
        .addColumn('type', sql`file_types`, (col) => col.notNull())
        .addColumn('name', 'varchar(100)', (col) => col.notNull())
        .addColumn('parent_path', 'text')
        .addColumn('sha', 'varchar(255)', (col) => col.notNull())
        .addColumn('url', 'text', (col) => col.notNull())
        .addColumn('depth', 'integer', (col) => col.notNull().defaultTo(0))
        

        .addUniqueConstraint('file_repo_unique', [
            'repository_id',
            'path',
        ])
        .execute()

    await db.schema
        .createIndex('files_repo_idx')
        .on('files')
        .column('repository_id')
        .execute()

  

    await db.schema
        .createIndex('files_depth_idx')
        .on('files')
        .column('depth')
        .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('files').execute()
  await db.schema.dropType('file_types').execute()
}

