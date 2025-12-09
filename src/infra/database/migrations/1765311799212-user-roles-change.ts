import { MigrationInterface, QueryRunner } from "typeorm";

export class UserRolesChange1765311799212 implements MigrationInterface {
    name = 'UserRolesChange1765311799212'

   public async up(queryRunner: QueryRunner): Promise<void> {
    // 1) Rename the old enum
    await queryRunner.query(
        `ALTER TYPE "public"."users_role_enum" RENAME TO "users_role_enum_old"`
    );

    // 2) Create the new enum (with GUEST added)
    await queryRunner.query(
        `CREATE TYPE "public"."users_role_enum" AS ENUM('ADMIN', 'MEMBER', 'GHOST', 'GUEST')`
    );

    // 3) Drop default so we can change type
    await queryRunner.query(
        `ALTER TABLE "users" ALTER COLUMN "role" DROP DEFAULT`
    );

    // 4) Convert column to new enum
    await queryRunner.query(`
        ALTER TABLE "users"
        ALTER COLUMN "role"
        TYPE "public"."users_role_enum"
        USING "role"::text::"public"."users_role_enum"
    `);

    // 5) Now update values safely
    await queryRunner.query(
        `UPDATE "users" SET "role" = 'GUEST' WHERE "role" = 'GHOST'`
    );

    // 6) Set default
    await queryRunner.query(
        `ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'GUEST'`
    );

    // 7) Drop the old enum
    await queryRunner.query(
        `DROP TYPE "public"."users_role_enum_old"`
    );
}

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum_old" AS ENUM('ADMIN', 'MEMBER', 'GHOST')`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "role" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "role" TYPE "public"."users_role_enum_old" USING "role"::"text"::"public"."users_role_enum_old"`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'GHOST'`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."users_role_enum_old" RENAME TO "users_role_enum"`);
    }

}
