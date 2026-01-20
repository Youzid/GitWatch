import { sql, type Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
    await db.schema
    .createType('file_types')
    .asEnum(['BLOB', 'TREE'])
    .execute()

    await db.schema
        .createTable('repo_files')
        .addColumn('id', 'serial', (col) => col.primaryKey())
        .addColumn('repository_id', 'integer', (col) =>
            col.references('repositories.id').notNull().onDelete('cascade')
        )
        .addColumn('path', 'text', (col) => col.notNull())
        .addColumn('name', 'varchar(100)', (col) => col.notNull())
        .addColumn('type', sql`file_types`, (col) => col.notNull())
        .addColumn('size', 'integer')
        
        .addColumn('depth', 'integer', (col) => col.notNull())
        .addColumn('parent_path', 'text', (col) => col.notNull())
        .addColumn('sha', 'varchar(255)', (col) => col.notNull())

        .addUniqueConstraint('repo_files_repo_path_unique', [
            'repository_id',
            'path',
        ])
        .execute()

    await db.schema
        .createIndex('repo_files_repo_idx')
        .on('repo_files')
        .column('repository_id')
        .execute()

    await db.schema
        .createIndex('repo_files_parent_idx')
        .on('repo_files')
        .column('parent_path')
        .execute()

    await db.schema
        .createIndex('repo_files_depth_idx')
        .on('repo_files')
        .column('depth')
        .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('repo_files').execute()
  await db.schema.dropType('file_types').execute()
}

