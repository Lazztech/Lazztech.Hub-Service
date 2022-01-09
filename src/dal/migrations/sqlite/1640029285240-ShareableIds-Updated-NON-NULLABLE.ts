import { Migration } from "@mikro-orm/migrations";

export class ShareableIdsUpdatedNONNULLABLE1640029285240 extends Migration {
    name = 'ShareableIdsUpdatedNONNULLABLE1640029285240'

    public async up(): Promise<void> {
        this.addSql(`CREATE TABLE "temporary_user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "firstName" varchar NOT NULL, "lastName" varchar NOT NULL, "birthdate" varchar, "description" varchar, "image" varchar, "email" varchar NOT NULL, "password" varchar NOT NULL, "passwordResetId" integer, "shareableId" varchar, CONSTRAINT "REL_5d250ff0a3f3eba15ff2db819d" UNIQUE ("passwordResetId"), CONSTRAINT "FK_5d250ff0a3f3eba15ff2db819dd" FOREIGN KEY ("passwordResetId") REFERENCES "password_reset" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        this.addSql(`INSERT INTO "temporary_user"("id", "firstName", "lastName", "birthdate", "description", "image", "email", "password", "passwordResetId", "shareableId") SELECT "id", "firstName", "lastName", "birthdate", "description", "image", "email", "password", "passwordResetId", "shareableId" FROM "user"`);
        this.addSql(`DROP TABLE "user"`);
        this.addSql(`ALTER TABLE "temporary_user" RENAME TO "user"`);
        this.addSql(`CREATE TABLE "temporary_hub" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "description" varchar, "active" boolean NOT NULL DEFAULT (0), "image" varchar, "latitude" float, "longitude" float, "shareableId" varchar)`);
        this.addSql(`INSERT INTO "temporary_hub"("id", "name", "description", "active", "image", "latitude", "longitude", "shareableId") SELECT "id", "name", "description", "active", "image", "latitude", "longitude", "shareableId" FROM "hub"`);
        this.addSql(`DROP TABLE "hub"`);
        this.addSql(`ALTER TABLE "temporary_hub" RENAME TO "hub"`);
        this.addSql(`CREATE TABLE "temporary_user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "firstName" varchar NOT NULL, "lastName" varchar NOT NULL, "birthdate" varchar, "description" varchar, "image" varchar, "email" varchar NOT NULL, "password" varchar NOT NULL, "passwordResetId" integer, "shareableId" varchar NOT NULL, CONSTRAINT "REL_5d250ff0a3f3eba15ff2db819d" UNIQUE ("passwordResetId"), CONSTRAINT "FK_5d250ff0a3f3eba15ff2db819dd" FOREIGN KEY ("passwordResetId") REFERENCES "password_reset" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        this.addSql(`INSERT INTO "temporary_user"("id", "firstName", "lastName", "birthdate", "description", "image", "email", "password", "passwordResetId", "shareableId") SELECT "id", "firstName", "lastName", "birthdate", "description", "image", "email", "password", "passwordResetId", "shareableId" FROM "user"`);
        this.addSql(`DROP TABLE "user"`);
        this.addSql(`ALTER TABLE "temporary_user" RENAME TO "user"`);
        this.addSql(`CREATE TABLE "temporary_hub" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "description" varchar, "active" boolean NOT NULL DEFAULT (0), "image" varchar, "latitude" float, "longitude" float, "shareableId" varchar NOT NULL)`);
        this.addSql(`INSERT INTO "temporary_hub"("id", "name", "description", "active", "image", "latitude", "longitude", "shareableId") SELECT "id", "name", "description", "active", "image", "latitude", "longitude", "shareableId" FROM "hub"`);
        this.addSql(`DROP TABLE "hub"`);
        this.addSql(`ALTER TABLE "temporary_hub" RENAME TO "hub"`);
    }

    public async down(): Promise<void> {
        // await queryRunner.commitTransaction();
        // this.addSql('PRAGMA foreign_keys=off');
        // await queryRunner.startTransaction();
        this.addSql(`ALTER TABLE "hub" RENAME TO "temporary_hub"`);
        this.addSql(`CREATE TABLE "hub" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "description" varchar, "active" boolean NOT NULL DEFAULT (0), "image" varchar, "latitude" float, "longitude" float, "shareableId" varchar)`);
        this.addSql(`INSERT INTO "hub"("id", "name", "description", "active", "image", "latitude", "longitude", "shareableId") SELECT "id", "name", "description", "active", "image", "latitude", "longitude", "shareableId" FROM "temporary_hub"`);
        this.addSql(`DROP TABLE "temporary_hub"`);
        this.addSql(`ALTER TABLE "user" RENAME TO "temporary_user"`);
        this.addSql(`CREATE TABLE "user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "firstName" varchar NOT NULL, "lastName" varchar NOT NULL, "birthdate" varchar, "description" varchar, "image" varchar, "email" varchar NOT NULL, "password" varchar NOT NULL, "passwordResetId" integer, "shareableId" varchar, CONSTRAINT "REL_5d250ff0a3f3eba15ff2db819d" UNIQUE ("passwordResetId"), CONSTRAINT "FK_5d250ff0a3f3eba15ff2db819dd" FOREIGN KEY ("passwordResetId") REFERENCES "password_reset" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        this.addSql(`INSERT INTO "user"("id", "firstName", "lastName", "birthdate", "description", "image", "email", "password", "passwordResetId", "shareableId") SELECT "id", "firstName", "lastName", "birthdate", "description", "image", "email", "password", "passwordResetId", "shareableId" FROM "temporary_user"`);
        this.addSql(`DROP TABLE "temporary_user"`);
        this.addSql(`ALTER TABLE "hub" RENAME TO "temporary_hub"`);
        this.addSql(`CREATE TABLE "hub" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "description" varchar, "active" boolean NOT NULL DEFAULT (0), "image" varchar, "latitude" float, "longitude" float, "shareableId" varchar)`);
        this.addSql(`INSERT INTO "hub"("id", "name", "description", "active", "image", "latitude", "longitude", "shareableId") SELECT "id", "name", "description", "active", "image", "latitude", "longitude", "shareableId" FROM "temporary_hub"`);
        this.addSql(`DROP TABLE "temporary_hub"`);
        this.addSql(`ALTER TABLE "user" RENAME TO "temporary_user"`);
        this.addSql(`CREATE TABLE "user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "firstName" varchar NOT NULL, "lastName" varchar NOT NULL, "birthdate" varchar, "description" varchar, "image" varchar, "email" varchar NOT NULL, "password" varchar NOT NULL, "passwordResetId" integer, "shareableId" varchar, CONSTRAINT "REL_5d250ff0a3f3eba15ff2db819d" UNIQUE ("passwordResetId"), CONSTRAINT "FK_5d250ff0a3f3eba15ff2db819dd" FOREIGN KEY ("passwordResetId") REFERENCES "password_reset" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        this.addSql(`INSERT INTO "user"("id", "firstName", "lastName", "birthdate", "description", "image", "email", "password", "passwordResetId", "shareableId") SELECT "id", "firstName", "lastName", "birthdate", "description", "image", "email", "password", "passwordResetId", "shareableId" FROM "temporary_user"`);
        this.addSql(`DROP TABLE "temporary_user"`);
        // this.addSql('PRAGMA main.foreign_key_check')
        // this.addSql('PRAGMA foreign_keys=on');
    }

}
