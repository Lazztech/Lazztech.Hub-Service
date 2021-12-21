import {MigrationInterface, QueryRunner} from "typeorm";

export class initialMigration1639451182481 implements MigrationInterface {
    name = 'initialMigration1639451182481'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "in_app_notification" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "userId" integer NOT NULL, "header" varchar, "text" varchar NOT NULL, "date" varchar NOT NULL, "thumbnail" varchar, "actionLink" varchar)`);
        await queryRunner.query(`CREATE TABLE "invite" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "invitersId" integer NOT NULL, "inviteesId" integer NOT NULL, "hubId" integer NOT NULL, "accepted" boolean NOT NULL DEFAULT (0))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_c8772f9bcb1e9f4faaa9c8873d" ON "invite" ("invitersId", "inviteesId", "hubId") `);
        await queryRunner.query(`CREATE TABLE "password_reset" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "pin" varchar NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "user_device" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "fcmPushUserToken" varchar NOT NULL, "userId" integer NOT NULL, CONSTRAINT "UQ_9fa10355d40f3311b221b15c04c" UNIQUE ("fcmPushUserToken"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "firstName" varchar NOT NULL, "lastName" varchar NOT NULL, "birthdate" varchar, "description" varchar, "image" varchar, "email" varchar NOT NULL, "password" varchar NOT NULL, "passwordResetId" integer, CONSTRAINT "REL_5d250ff0a3f3eba15ff2db819d" UNIQUE ("passwordResetId"))`);
        await queryRunner.query(`CREATE TABLE "join_user_hub" ("userId" integer NOT NULL, "hubId" integer NOT NULL, "isOwner" boolean NOT NULL, "starred" boolean NOT NULL DEFAULT (0), "isPresent" boolean NOT NULL DEFAULT (0), PRIMARY KEY ("userId", "hubId"))`);
        await queryRunner.query(`CREATE TABLE "micro_chat" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "hubId" integer NOT NULL, "text" varchar NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "hub" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "description" varchar, "active" boolean NOT NULL DEFAULT (0), "image" varchar, "latitude" float, "longitude" float)`);
        await queryRunner.query(`CREATE TABLE "temporary_in_app_notification" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "userId" integer NOT NULL, "header" varchar, "text" varchar NOT NULL, "date" varchar NOT NULL, "thumbnail" varchar, "actionLink" varchar, CONSTRAINT "FK_601c38c9c36ccb73492dd589a27" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_in_app_notification"("id", "userId", "header", "text", "date", "thumbnail", "actionLink") SELECT "id", "userId", "header", "text", "date", "thumbnail", "actionLink" FROM "in_app_notification"`);
        await queryRunner.query(`DROP TABLE "in_app_notification"`);
        await queryRunner.query(`ALTER TABLE "temporary_in_app_notification" RENAME TO "in_app_notification"`);
        await queryRunner.query(`DROP INDEX "IDX_c8772f9bcb1e9f4faaa9c8873d"`);
        await queryRunner.query(`CREATE TABLE "temporary_invite" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "invitersId" integer NOT NULL, "inviteesId" integer NOT NULL, "hubId" integer NOT NULL, "accepted" boolean NOT NULL DEFAULT (0), CONSTRAINT "FK_62a6d64bc66200d81a0208473a7" FOREIGN KEY ("invitersId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_fc16ddbaef2a4bf27d46bc78555" FOREIGN KEY ("inviteesId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_20d407b86806cc510cf8676e7fc" FOREIGN KEY ("hubId") REFERENCES "hub" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_invite"("id", "invitersId", "inviteesId", "hubId", "accepted") SELECT "id", "invitersId", "inviteesId", "hubId", "accepted" FROM "invite"`);
        await queryRunner.query(`DROP TABLE "invite"`);
        await queryRunner.query(`ALTER TABLE "temporary_invite" RENAME TO "invite"`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_c8772f9bcb1e9f4faaa9c8873d" ON "invite" ("invitersId", "inviteesId", "hubId") `);
        await queryRunner.query(`CREATE TABLE "temporary_user_device" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "fcmPushUserToken" varchar NOT NULL, "userId" integer NOT NULL, CONSTRAINT "UQ_9fa10355d40f3311b221b15c04c" UNIQUE ("fcmPushUserToken"), CONSTRAINT "FK_bda1afb30d9e3e8fb30b1e90af7" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_user_device"("id", "fcmPushUserToken", "userId") SELECT "id", "fcmPushUserToken", "userId" FROM "user_device"`);
        await queryRunner.query(`DROP TABLE "user_device"`);
        await queryRunner.query(`ALTER TABLE "temporary_user_device" RENAME TO "user_device"`);
        await queryRunner.query(`CREATE TABLE "temporary_user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "firstName" varchar NOT NULL, "lastName" varchar NOT NULL, "birthdate" varchar, "description" varchar, "image" varchar, "email" varchar NOT NULL, "password" varchar NOT NULL, "passwordResetId" integer, CONSTRAINT "REL_5d250ff0a3f3eba15ff2db819d" UNIQUE ("passwordResetId"), CONSTRAINT "FK_5d250ff0a3f3eba15ff2db819dd" FOREIGN KEY ("passwordResetId") REFERENCES "password_reset" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_user"("id", "firstName", "lastName", "birthdate", "description", "image", "email", "password", "passwordResetId") SELECT "id", "firstName", "lastName", "birthdate", "description", "image", "email", "password", "passwordResetId" FROM "user"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`ALTER TABLE "temporary_user" RENAME TO "user"`);
        await queryRunner.query(`CREATE TABLE "temporary_join_user_hub" ("userId" integer NOT NULL, "hubId" integer NOT NULL, "isOwner" boolean NOT NULL, "starred" boolean NOT NULL DEFAULT (0), "isPresent" boolean NOT NULL DEFAULT (0), CONSTRAINT "FK_9b7e78f7bcde729db66f0981bf8" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_77f66af41fadebe148e9717499d" FOREIGN KEY ("hubId") REFERENCES "hub" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, PRIMARY KEY ("userId", "hubId"))`);
        await queryRunner.query(`INSERT INTO "temporary_join_user_hub"("userId", "hubId", "isOwner", "starred", "isPresent") SELECT "userId", "hubId", "isOwner", "starred", "isPresent" FROM "join_user_hub"`);
        await queryRunner.query(`DROP TABLE "join_user_hub"`);
        await queryRunner.query(`ALTER TABLE "temporary_join_user_hub" RENAME TO "join_user_hub"`);
        await queryRunner.query(`CREATE TABLE "temporary_micro_chat" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "hubId" integer NOT NULL, "text" varchar NOT NULL, CONSTRAINT "FK_72c2b3741b8118e0e074aa1cb32" FOREIGN KEY ("hubId") REFERENCES "hub" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_micro_chat"("id", "hubId", "text") SELECT "id", "hubId", "text" FROM "micro_chat"`);
        await queryRunner.query(`DROP TABLE "micro_chat"`);
        await queryRunner.query(`ALTER TABLE "temporary_micro_chat" RENAME TO "micro_chat"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.commitTransaction();
        await queryRunner.query('PRAGMA foreign_keys=off');
        await queryRunner.startTransaction();
        await queryRunner.query(`ALTER TABLE "micro_chat" RENAME TO "temporary_micro_chat"`);
        await queryRunner.query(`CREATE TABLE "micro_chat" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "hubId" integer NOT NULL, "text" varchar NOT NULL)`);
        await queryRunner.query(`INSERT INTO "micro_chat"("id", "hubId", "text") SELECT "id", "hubId", "text" FROM "temporary_micro_chat"`);
        await queryRunner.query(`DROP TABLE "temporary_micro_chat"`);
        await queryRunner.query(`ALTER TABLE "join_user_hub" RENAME TO "temporary_join_user_hub"`);
        await queryRunner.query(`CREATE TABLE "join_user_hub" ("userId" integer NOT NULL, "hubId" integer NOT NULL, "isOwner" boolean NOT NULL, "starred" boolean NOT NULL DEFAULT (0), "isPresent" boolean NOT NULL DEFAULT (0), PRIMARY KEY ("userId", "hubId"))`);
        await queryRunner.query(`INSERT INTO "join_user_hub"("userId", "hubId", "isOwner", "starred", "isPresent") SELECT "userId", "hubId", "isOwner", "starred", "isPresent" FROM "temporary_join_user_hub"`);
        await queryRunner.query(`DROP TABLE "temporary_join_user_hub"`);
        await queryRunner.query(`ALTER TABLE "user" RENAME TO "temporary_user"`);
        await queryRunner.query(`CREATE TABLE "user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "firstName" varchar NOT NULL, "lastName" varchar NOT NULL, "birthdate" varchar, "description" varchar, "image" varchar, "email" varchar NOT NULL, "password" varchar NOT NULL, "passwordResetId" integer, CONSTRAINT "REL_5d250ff0a3f3eba15ff2db819d" UNIQUE ("passwordResetId"))`);
        await queryRunner.query(`INSERT INTO "user"("id", "firstName", "lastName", "birthdate", "description", "image", "email", "password", "passwordResetId") SELECT "id", "firstName", "lastName", "birthdate", "description", "image", "email", "password", "passwordResetId" FROM "temporary_user"`);
        await queryRunner.query(`DROP TABLE "temporary_user"`);
        await queryRunner.query(`ALTER TABLE "user_device" RENAME TO "temporary_user_device"`);
        await queryRunner.query(`CREATE TABLE "user_device" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "fcmPushUserToken" varchar NOT NULL, "userId" integer NOT NULL, CONSTRAINT "UQ_9fa10355d40f3311b221b15c04c" UNIQUE ("fcmPushUserToken"))`);
        await queryRunner.query(`INSERT INTO "user_device"("id", "fcmPushUserToken", "userId") SELECT "id", "fcmPushUserToken", "userId" FROM "temporary_user_device"`);
        await queryRunner.query(`DROP TABLE "temporary_user_device"`);
        await queryRunner.query(`DROP INDEX "IDX_c8772f9bcb1e9f4faaa9c8873d"`);
        await queryRunner.query(`ALTER TABLE "invite" RENAME TO "temporary_invite"`);
        await queryRunner.query(`CREATE TABLE "invite" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "invitersId" integer NOT NULL, "inviteesId" integer NOT NULL, "hubId" integer NOT NULL, "accepted" boolean NOT NULL DEFAULT (0))`);
        await queryRunner.query(`INSERT INTO "invite"("id", "invitersId", "inviteesId", "hubId", "accepted") SELECT "id", "invitersId", "inviteesId", "hubId", "accepted" FROM "temporary_invite"`);
        await queryRunner.query(`DROP TABLE "temporary_invite"`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_c8772f9bcb1e9f4faaa9c8873d" ON "invite" ("invitersId", "inviteesId", "hubId") `);
        await queryRunner.query(`ALTER TABLE "in_app_notification" RENAME TO "temporary_in_app_notification"`);
        await queryRunner.query(`CREATE TABLE "in_app_notification" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "userId" integer NOT NULL, "header" varchar, "text" varchar NOT NULL, "date" varchar NOT NULL, "thumbnail" varchar, "actionLink" varchar)`);
        await queryRunner.query(`INSERT INTO "in_app_notification"("id", "userId", "header", "text", "date", "thumbnail", "actionLink") SELECT "id", "userId", "header", "text", "date", "thumbnail", "actionLink" FROM "temporary_in_app_notification"`);
        await queryRunner.query(`DROP TABLE "temporary_in_app_notification"`);
        await queryRunner.query(`DROP TABLE "hub"`);
        await queryRunner.query(`DROP TABLE "micro_chat"`);
        await queryRunner.query(`DROP TABLE "join_user_hub"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "user_device"`);
        await queryRunner.query(`DROP TABLE "password_reset"`);
        await queryRunner.query(`DROP INDEX "IDX_c8772f9bcb1e9f4faaa9c8873d"`);
        await queryRunner.query(`DROP TABLE "invite"`);
        await queryRunner.query(`DROP TABLE "in_app_notification"`);
    }

}
