import { MigrationInterface, QueryRunner } from 'typeorm';

export class User1755092191001 implements MigrationInterface {
  name = 'User1755092191001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE "user"."users_role_enum" AS ENUM('Master', 'Admin', 'User')
    `);
    await queryRunner.query(`
      CREATE TABLE "user"."users" (
        "id" BIGSERIAL NOT NULL,
        "created_at" TIMESTAMP(3) WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(3) with time zone,
        "updated_at" TIMESTAMP(3) WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(3) with time zone,
        "deleted_at" TIMESTAMP(3) WITH TIME ZONE,
        "role" "user"."users_role_enum" NOT NULL DEFAULT 'User',
        "username" character varying(50),
        "password_hash" character varying(200),
        "name" character varying(50),
        "email" character varying(100),
        "phone" character varying(100),
        "password_changed_at" TIMESTAMP(3) WITH TIME ZONE,
        CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"),
        CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_de62bdd797c33850030bea22d6" ON "user"."users" ("deleted_at", "created_at")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP INDEX "user"."IDX_de62bdd797c33850030bea22d6"
    `);
    await queryRunner.query(`
      DROP TABLE "user"."users"
    `);
    await queryRunner.query(`
      DROP TYPE "user"."users_role_enum"
    `);
  }
}
