import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  // Create custom types
  await db.schema
    .createType('pr_status')
    .asEnum(['OPEN', 'MERGED', 'CLOSED'])
    .execute()

  await db.schema
    .createType('user_role')
    .asEnum(['OWNER', 'COLLABORATOR', 'VIEWER'])
    .execute()

  // Create users table
  await db.schema
    .createTable('users')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('email', 'varchar(255)', (col) => col.notNull().unique())
    .addColumn('username', 'varchar(100)', (col) => col.notNull())
    .addColumn('password', 'varchar(255)', (col) => col.notNull())
    .addColumn('avatar_url', 'varchar(255)')
    .addColumn('is_active', 'boolean', (col) => col.notNull().defaultTo(false))
    .addColumn('created_at', 'timestamp', (col) => col.defaultTo(sql`now()`))
    .execute()

  // Create repositories table
  await db.schema
    .createTable('repositories')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('owner_id', 'integer', (col) => 
      col.references('users.id')
    )
    .addColumn('name', 'varchar(255)', (col) => col.notNull())
    .addColumn('is_active', 'boolean', (col) => col.defaultTo(true))
    .addColumn('default_branch', 'varchar(100)', (col) => col.defaultTo('main'))
    .addColumn('provider_repo_id', 'varchar(255)', (col) => col.unique())
    .addColumn('created_at', 'timestamp', (col) => col.defaultTo(sql`now()`))
    .addColumn('updated_at', 'timestamp', (col) => col.defaultTo(sql`now()`))
    .execute()

  // Create pull_requests table
  await db.schema
    .createTable('pull_requests')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('repository_id', 'integer', (col) => 
      col.references('repositories.id').notNull()
    )
    .addColumn('pr_number', 'integer', (col) => col.notNull())
    .addColumn('provider_id', 'integer')
    .addColumn('title', 'varchar(255)')
    .addColumn('author_email', 'varchar(255)', (col) =>
      col.references('users.email')
    )
    .addColumn('status', sql`pr_status`)
    .addColumn('head_sha', 'varchar(40)')
    .addColumn('base_sha', 'varchar(40)')
    .addColumn('created_at', 'timestamp', (col) => col.defaultTo(sql`now()`))
    .addColumn('updated_at', 'timestamp', (col) => col.defaultTo(sql`now()`))
    .execute()

  // Create commits table
  await db.schema
    .createTable('commits')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('repository_id', 'integer', (col) => 
      col.references('repositories.id').notNull()
    )
    .addColumn('pull_request_id', 'integer', (col) =>
      col.references('pull_requests.id')
    )
    .addColumn('sha', 'varchar(40)', (col) => col.notNull())
    .addColumn('author_name', 'varchar(100)')
    .addColumn('author_email', 'varchar(255)', (col) =>
      col.references('users.email')
    )
    .addColumn('message', 'text')
    .addColumn('committed_at', 'timestamp')
    .addColumn('analyzed_at', 'timestamp')
    .addColumn('branch', 'varchar(100)')
    .addColumn('created_at', 'timestamp', (col) => col.defaultTo(sql`now()`))
    .addColumn('updated_at', 'timestamp', (col) => col.defaultTo(sql`now()`))
    .execute()

  // Create commit_files table
  await db.schema
    .createTable('commit_files')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('commit_id', 'integer', (col) => 
      col.references('commits.id').notNull()
    )
    .addColumn('filename', 'text', (col) => col.notNull())
    .addColumn('additions', 'integer', (col) => col.defaultTo(0))
    .addColumn('deletions', 'integer', (col) => col.defaultTo(0))
    .addColumn('changes', 'integer', (col) => col.defaultTo(0))
    .addColumn('status', 'varchar(50)')
    .addColumn('created_at', 'timestamp', (col) => col.defaultTo(sql`now()`))
    .addColumn('updated_at', 'timestamp', (col) => col.defaultTo(sql`now()`))
    .execute()

  // Create repo_user junction table
  await db.schema
    .createTable('repo_user')
    .addColumn('user_id', 'integer', (col) => 
      col.references('users.id').notNull()
    )
    .addColumn('repository_id', 'integer', (col) => 
      col.references('repositories.id').notNull()
    )
    .addColumn('role', sql`user_role`)
    .addColumn('created_at', 'timestamp', (col) => col.defaultTo(sql`now()`))
    .addColumn('updated_at', 'timestamp', (col) => col.defaultTo(sql`now()`))
    .addPrimaryKeyConstraint('repo_user_pkey', ['user_id', 'repository_id'])
    .execute()

  // Create refresh_tokens table
  await db.schema
    .createTable('refresh_tokens')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('user_id', 'integer', (col) => 
      col.references('users.id').onDelete('cascade').notNull()
    )
    .addColumn('token_hash', 'text', (col) => col.notNull())
    .addColumn('device_id', 'varchar(255)')
    .addColumn('ip_address', 'text')
    .addColumn('expires_at', 'timestamptz', (col) => col.notNull())
    .addColumn('revoked_at', 'timestamptz')
    .addColumn('created_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`now()`))
    .execute()

  // Create email_verification_tokens table
  await db.schema
    .createTable('email_verification_tokens')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('user_id', 'integer', (col) => 
      col.references('users.id').onDelete('cascade').notNull()
    )
    .addColumn('token_hash', 'text', (col) => col.notNull())
    .addColumn('expires_at', 'timestamptz', (col) => col.notNull())
    .addColumn('created_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`now()`))
    .execute()

  // Create indexes for refresh_tokens
  await db.schema
    .createIndex('idx_refresh_tokens_user_id')
    .on('refresh_tokens')
    .column('user_id')
    .execute()

  await db.schema
    .createIndex('idx_refresh_tokens_token_hash')
    .on('refresh_tokens')
    .column('token_hash')
    .execute()

  await db.schema
    .createIndex('idx_refresh_tokens_not_revoked')
    .on('refresh_tokens')
    .column('user_id')
    .execute()

  // Create indexes for email_verification_tokens
  await db.schema
    .createIndex('idx_email_verification_user_id')
    .on('email_verification_tokens')
    .column('user_id')
    .execute()

  await db.schema
    .createIndex('idx_email_verification_token_hash')
    .on('email_verification_tokens')
    .column('token_hash')
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  // Drop tables in reverse order (respecting foreign keys)
  await db.schema.dropTable('email_verification_tokens').ifExists().execute()
  await db.schema.dropTable('refresh_tokens').ifExists().execute()
  await db.schema.dropTable('repo_user').ifExists().execute()
  await db.schema.dropTable('commit_files').ifExists().execute()
  await db.schema.dropTable('commits').ifExists().execute()
  await db.schema.dropTable('pull_requests').ifExists().execute()
  await db.schema.dropTable('repositories').ifExists().execute()
  await db.schema.dropTable('users').ifExists().execute()

  // Drop custom types
  await db.schema.dropType('user_role').ifExists().execute()
  await db.schema.dropType('pr_status').ifExists().execute()
}