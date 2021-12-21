import {MigrationInterface, QueryRunner} from "typeorm";

export class ShareableIdsUpdatedNONNULLABLE1640029285240 implements MigrationInterface {
    name = 'ShareableIdsUpdatedNONNULLABLE1640029285240'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "temporary_user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "firstName" varchar NOT NULL, "lastName" varchar NOT NULL, "birthdate" varchar, "description" varchar, "image" varchar, "email" varchar NOT NULL, "password" varchar NOT NULL, "passwordResetId" integer, "shareableId" varchar, CONSTRAINT "REL_5d250ff0a3f3eba15ff2db819d" UNIQUE ("passwordResetId"), CONSTRAINT "FK_5d250ff0a3f3eba15ff2db819dd" FOREIGN KEY ("passwordResetId") REFERENCES "password_reset" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_user"("id", "firstName", "lastName", "birthdate", "description", "image", "email", "password", "passwordResetId", "shareableId") SELECT "id", "firstName", "lastName", "birthdate", "description", "image", "email", "password", "passwordResetId", "shareableId" FROM "user"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`ALTER TABLE "temporary_user" RENAME TO "user"`);
        await queryRunner.query(`CREATE TABLE "temporary_hub" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "description" varchar, "active" boolean NOT NULL DEFAULT (0), "image" varchar, "latitude" float, "longitude" float, "shareableId" varchar)`);
        await queryRunner.query(`INSERT INTO "temporary_hub"("id", "name", "description", "active", "image", "latitude", "longitude", "shareableId") SELECT "id", "name", "description", "active", "image", "latitude", "longitude", "shareableId" FROM "hub"`);
        await queryRunner.query(`DROP TABLE "hub"`);
        await queryRunner.query(`ALTER TABLE "temporary_hub" RENAME TO "hub"`);
        await queryRunner.query(`CREATE TABLE "temporary_user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "firstName" varchar NOT NULL, "lastName" varchar NOT NULL, "birthdate" varchar, "description" varchar, "image" varchar, "email" varchar NOT NULL, "password" varchar NOT NULL, "passwordResetId" integer, "shareableId" varchar NOT NULL, CONSTRAINT "REL_5d250ff0a3f3eba15ff2db819d" UNIQUE ("passwordResetId"), CONSTRAINT "FK_5d250ff0a3f3eba15ff2db819dd" FOREIGN KEY ("passwordResetId") REFERENCES "password_reset" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_user"("id", "firstName", "lastName", "birthdate", "description", "image", "email", "password", "passwordResetId", "shareableId") SELECT "id", "firstName", "lastName", "birthdate", "description", "image", "email", "password", "passwordResetId", "shareableId" FROM "user"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`ALTER TABLE "temporary_user" RENAME TO "user"`);
        await queryRunner.query(`CREATE TABLE "temporary_hub" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "description" varchar, "active" boolean NOT NULL DEFAULT (0), "image" varchar, "latitude" float, "longitude" float, "shareableId" varchar NOT NULL)`);
        await queryRunner.query(`INSERT INTO "temporary_hub"("id", "name", "description", "active", "image", "latitude", "longitude", "shareableId") SELECT "id", "name", "description", "active", "image", "latitude", "longitude", "shareableId" FROM "hub"`);
        await queryRunner.query(`DROP TABLE "hub"`);
        await queryRunner.query(`ALTER TABLE "temporary_hub" RENAME TO "hub"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "hub" RENAME TO "temporary_hub"`);
        await queryRunner.query(`CREATE TABLE "hub" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "description" varchar, "active" boolean NOT NULL DEFAULT (0), "image" varchar, "latitude" float, "longitude" float, "shareableId" varchar)`);
        await queryRunner.query(`INSERT INTO "hub"("id", "name", "description", "active", "image", "latitude", "longitude", "shareableId") SELECT "id", "name", "description", "active", "image", "latitude", "longitude", "shareableId" FROM "temporary_hub"`);
        await queryRunner.query(`DROP TABLE "temporary_hub"`);
        await queryRunner.query(`ALTER TABLE "user" RENAME TO "temporary_user"`);
        await queryRunner.query(`CREATE TABLE "user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "firstName" varchar NOT NULL, "lastName" varchar NOT NULL, "birthdate" varchar, "description" varchar, "image" varchar, "email" varchar NOT NULL, "password" varchar NOT NULL, "passwordResetId" integer, "shareableId" varchar, CONSTRAINT "REL_5d250ff0a3f3eba15ff2db819d" UNIQUE ("passwordResetId"), CONSTRAINT "FK_5d250ff0a3f3eba15ff2db819dd" FOREIGN KEY ("passwordResetId") REFERENCES "password_reset" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "user"("id", "firstName", "lastName", "birthdate", "description", "image", "email", "password", "passwordResetId", "shareableId") SELECT "id", "firstName", "lastName", "birthdate", "description", "image", "email", "password", "passwordResetId", "shareableId" FROM "temporary_user"`);
        await queryRunner.query(`DROP TABLE "temporary_user"`);
        await queryRunner.query(`ALTER TABLE "hub" RENAME TO "temporary_hub"`);
        await queryRunner.query(`CREATE TABLE "hub" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "description" varchar, "active" boolean NOT NULL DEFAULT (0), "image" varchar, "latitude" float, "longitude" float, "shareableId" varchar)`);
        await queryRunner.query(`INSERT INTO "hub"("id", "name", "description", "active", "image", "latitude", "longitude", "shareableId") SELECT "id", "name", "description", "active", "image", "latitude", "longitude", "shareableId" FROM "temporary_hub"`);
        await queryRunner.query(`DROP TABLE "temporary_hub"`);
        await queryRunner.query(`ALTER TABLE "user" RENAME TO "temporary_user"`);
        await queryRunner.query(`CREATE TABLE "user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "firstName" varchar NOT NULL, "lastName" varchar NOT NULL, "birthdate" varchar, "description" varchar, "image" varchar, "email" varchar NOT NULL, "password" varchar NOT NULL, "passwordResetId" integer, "shareableId" varchar, CONSTRAINT "REL_5d250ff0a3f3eba15ff2db819d" UNIQUE ("passwordResetId"), CONSTRAINT "FK_5d250ff0a3f3eba15ff2db819dd" FOREIGN KEY ("passwordResetId") REFERENCES "password_reset" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "user"("id", "firstName", "lastName", "birthdate", "description", "image", "email", "password", "passwordResetId", "shareableId") SELECT "id", "firstName", "lastName", "birthdate", "description", "image", "email", "password", "passwordResetId", "shareableId" FROM "temporary_user"`);
        await queryRunner.query(`DROP TABLE "temporary_user"`);
    }

}
