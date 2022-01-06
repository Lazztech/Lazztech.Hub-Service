import { Migration } from '@mikro-orm/migrations';

export class initialMigration1639451182481 extends Migration {
    name = 'initialMigration1639451182481'

    public async up(): Promise<void> {
        this.addSql(`CREATE TABLE "in_app_notification" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "userId" integer NOT NULL, "header" varchar, "text" varchar NOT NULL, "date" varchar NOT NULL, "thumbnail" varchar, "actionLink" varchar)`);
        this.addSql(`CREATE TABLE "invite" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "invitersId" integer NOT NULL, "inviteesId" integer NOT NULL, "hubId" integer NOT NULL, "accepted" boolean NOT NULL DEFAULT (0))`);
        this.addSql(`CREATE UNIQUE INDEX "IDX_c8772f9bcb1e9f4faaa9c8873d" ON "invite" ("invitersId", "inviteesId", "hubId") `);
        this.addSql(`CREATE TABLE "password_reset" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "pin" varchar NOT NULL)`);
        this.addSql(`CREATE TABLE "user_device" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "fcmPushUserToken" varchar NOT NULL, "userId" integer NOT NULL, CONSTRAINT "UQ_9fa10355d40f3311b221b15c04c" UNIQUE ("fcmPushUserToken"))`);
        this.addSql(`CREATE TABLE "user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "firstName" varchar NOT NULL, "lastName" varchar NOT NULL, "birthdate" varchar, "description" varchar, "image" varchar, "email" varchar NOT NULL, "password" varchar NOT NULL, "passwordResetId" integer, CONSTRAINT "REL_5d250ff0a3f3eba15ff2db819d" UNIQUE ("passwordResetId"))`);
        this.addSql(`CREATE TABLE "join_user_hub" ("userId" integer NOT NULL, "hubId" integer NOT NULL, "isOwner" boolean NOT NULL, "starred" boolean NOT NULL DEFAULT (0), "isPresent" boolean NOT NULL DEFAULT (0), PRIMARY KEY ("userId", "hubId"))`);
        this.addSql(`CREATE TABLE "micro_chat" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "hubId" integer NOT NULL, "text" varchar NOT NULL)`);
        this.addSql(`CREATE TABLE "hub" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "description" varchar, "active" boolean NOT NULL DEFAULT (0), "image" varchar, "latitude" float, "longitude" float)`);
        this.addSql(`CREATE TABLE "temporary_in_app_notification" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "userId" integer NOT NULL, "header" varchar, "text" varchar NOT NULL, "date" varchar NOT NULL, "thumbnail" varchar, "actionLink" varchar, CONSTRAINT "FK_601c38c9c36ccb73492dd589a27" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        this.addSql(`INSERT INTO "temporary_in_app_notification"("id", "userId", "header", "text", "date", "thumbnail", "actionLink") SELECT "id", "userId", "header", "text", "date", "thumbnail", "actionLink" FROM "in_app_notification"`);
        this.addSql(`DROP TABLE "in_app_notification"`);
        this.addSql(`ALTER TABLE "temporary_in_app_notification" RENAME TO "in_app_notification"`);
        this.addSql(`DROP INDEX "IDX_c8772f9bcb1e9f4faaa9c8873d"`);
        this.addSql(`CREATE TABLE "temporary_invite" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "invitersId" integer NOT NULL, "inviteesId" integer NOT NULL, "hubId" integer NOT NULL, "accepted" boolean NOT NULL DEFAULT (0), CONSTRAINT "FK_62a6d64bc66200d81a0208473a7" FOREIGN KEY ("invitersId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_fc16ddbaef2a4bf27d46bc78555" FOREIGN KEY ("inviteesId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_20d407b86806cc510cf8676e7fc" FOREIGN KEY ("hubId") REFERENCES "hub" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        this.addSql(`INSERT INTO "temporary_invite"("id", "invitersId", "inviteesId", "hubId", "accepted") SELECT "id", "invitersId", "inviteesId", "hubId", "accepted" FROM "invite"`);
        this.addSql(`DROP TABLE "invite"`);
        this.addSql(`ALTER TABLE "temporary_invite" RENAME TO "invite"`);
        this.addSql(`CREATE UNIQUE INDEX "IDX_c8772f9bcb1e9f4faaa9c8873d" ON "invite" ("invitersId", "inviteesId", "hubId") `);
        this.addSql(`CREATE TABLE "temporary_user_device" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "fcmPushUserToken" varchar NOT NULL, "userId" integer NOT NULL, CONSTRAINT "UQ_9fa10355d40f3311b221b15c04c" UNIQUE ("fcmPushUserToken"), CONSTRAINT "FK_bda1afb30d9e3e8fb30b1e90af7" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        this.addSql(`INSERT INTO "temporary_user_device"("id", "fcmPushUserToken", "userId") SELECT "id", "fcmPushUserToken", "userId" FROM "user_device"`);
        this.addSql(`DROP TABLE "user_device"`);
        this.addSql(`ALTER TABLE "temporary_user_device" RENAME TO "user_device"`);
        this.addSql(`CREATE TABLE "temporary_user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "firstName" varchar NOT NULL, "lastName" varchar NOT NULL, "birthdate" varchar, "description" varchar, "image" varchar, "email" varchar NOT NULL, "password" varchar NOT NULL, "passwordResetId" integer, CONSTRAINT "REL_5d250ff0a3f3eba15ff2db819d" UNIQUE ("passwordResetId"), CONSTRAINT "FK_5d250ff0a3f3eba15ff2db819dd" FOREIGN KEY ("passwordResetId") REFERENCES "password_reset" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        this.addSql(`INSERT INTO "temporary_user"("id", "firstName", "lastName", "birthdate", "description", "image", "email", "password", "passwordResetId") SELECT "id", "firstName", "lastName", "birthdate", "description", "image", "email", "password", "passwordResetId" FROM "user"`);
        this.addSql(`DROP TABLE "user"`);
        this.addSql(`ALTER TABLE "temporary_user" RENAME TO "user"`);
        this.addSql(`CREATE TABLE "temporary_join_user_hub" ("userId" integer NOT NULL, "hubId" integer NOT NULL, "isOwner" boolean NOT NULL, "starred" boolean NOT NULL DEFAULT (0), "isPresent" boolean NOT NULL DEFAULT (0), CONSTRAINT "FK_9b7e78f7bcde729db66f0981bf8" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_77f66af41fadebe148e9717499d" FOREIGN KEY ("hubId") REFERENCES "hub" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, PRIMARY KEY ("userId", "hubId"))`);
        this.addSql(`INSERT INTO "temporary_join_user_hub"("userId", "hubId", "isOwner", "starred", "isPresent") SELECT "userId", "hubId", "isOwner", "starred", "isPresent" FROM "join_user_hub"`);
        this.addSql(`DROP TABLE "join_user_hub"`);
        this.addSql(`ALTER TABLE "temporary_join_user_hub" RENAME TO "join_user_hub"`);
        this.addSql(`CREATE TABLE "temporary_micro_chat" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "hubId" integer NOT NULL, "text" varchar NOT NULL, CONSTRAINT "FK_72c2b3741b8118e0e074aa1cb32" FOREIGN KEY ("hubId") REFERENCES "hub" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        this.addSql(`INSERT INTO "temporary_micro_chat"("id", "hubId", "text") SELECT "id", "hubId", "text" FROM "micro_chat"`);
        this.addSql(`DROP TABLE "micro_chat"`);
        this.addSql(`ALTER TABLE "temporary_micro_chat" RENAME TO "micro_chat"`);
    }

    public async down(): Promise<void> {
        await queryRunner.commitTransaction();
        this.addSql('PRAGMA foreign_keys=off');
        await queryRunner.startTransaction();
        this.addSql(`ALTER TABLE "micro_chat" RENAME TO "temporary_micro_chat"`);
        this.addSql(`CREATE TABLE "micro_chat" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "hubId" integer NOT NULL, "text" varchar NOT NULL)`);
        this.addSql(`INSERT INTO "micro_chat"("id", "hubId", "text") SELECT "id", "hubId", "text" FROM "temporary_micro_chat"`);
        this.addSql(`DROP TABLE "temporary_micro_chat"`);
        this.addSql(`ALTER TABLE "join_user_hub" RENAME TO "temporary_join_user_hub"`);
        this.addSql(`CREATE TABLE "join_user_hub" ("userId" integer NOT NULL, "hubId" integer NOT NULL, "isOwner" boolean NOT NULL, "starred" boolean NOT NULL DEFAULT (0), "isPresent" boolean NOT NULL DEFAULT (0), PRIMARY KEY ("userId", "hubId"))`);
        this.addSql(`INSERT INTO "join_user_hub"("userId", "hubId", "isOwner", "starred", "isPresent") SELECT "userId", "hubId", "isOwner", "starred", "isPresent" FROM "temporary_join_user_hub"`);
        this.addSql(`DROP TABLE "temporary_join_user_hub"`);
        this.addSql(`ALTER TABLE "user" RENAME TO "temporary_user"`);
        this.addSql(`CREATE TABLE "user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "firstName" varchar NOT NULL, "lastName" varchar NOT NULL, "birthdate" varchar, "description" varchar, "image" varchar, "email" varchar NOT NULL, "password" varchar NOT NULL, "passwordResetId" integer, CONSTRAINT "REL_5d250ff0a3f3eba15ff2db819d" UNIQUE ("passwordResetId"))`);
        this.addSql(`INSERT INTO "user"("id", "firstName", "lastName", "birthdate", "description", "image", "email", "password", "passwordResetId") SELECT "id", "firstName", "lastName", "birthdate", "description", "image", "email", "password", "passwordResetId" FROM "temporary_user"`);
        this.addSql(`DROP TABLE "temporary_user"`);
        this.addSql(`ALTER TABLE "user_device" RENAME TO "temporary_user_device"`);
        this.addSql(`CREATE TABLE "user_device" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "fcmPushUserToken" varchar NOT NULL, "userId" integer NOT NULL, CONSTRAINT "UQ_9fa10355d40f3311b221b15c04c" UNIQUE ("fcmPushUserToken"))`);
        this.addSql(`INSERT INTO "user_device"("id", "fcmPushUserToken", "userId") SELECT "id", "fcmPushUserToken", "userId" FROM "temporary_user_device"`);
        this.addSql(`DROP TABLE "temporary_user_device"`);
        this.addSql(`DROP INDEX "IDX_c8772f9bcb1e9f4faaa9c8873d"`);
        this.addSql(`ALTER TABLE "invite" RENAME TO "temporary_invite"`);
        this.addSql(`CREATE TABLE "invite" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "invitersId" integer NOT NULL, "inviteesId" integer NOT NULL, "hubId" integer NOT NULL, "accepted" boolean NOT NULL DEFAULT (0))`);
        this.addSql(`INSERT INTO "invite"("id", "invitersId", "inviteesId", "hubId", "accepted") SELECT "id", "invitersId", "inviteesId", "hubId", "accepted" FROM "temporary_invite"`);
        this.addSql(`DROP TABLE "temporary_invite"`);
        this.addSql(`CREATE UNIQUE INDEX "IDX_c8772f9bcb1e9f4faaa9c8873d" ON "invite" ("invitersId", "inviteesId", "hubId") `);
        this.addSql(`ALTER TABLE "in_app_notification" RENAME TO "temporary_in_app_notification"`);
        this.addSql(`CREATE TABLE "in_app_notification" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "userId" integer NOT NULL, "header" varchar, "text" varchar NOT NULL, "date" varchar NOT NULL, "thumbnail" varchar, "actionLink" varchar)`);
        this.addSql(`INSERT INTO "in_app_notification"("id", "userId", "header", "text", "date", "thumbnail", "actionLink") SELECT "id", "userId", "header", "text", "date", "thumbnail", "actionLink" FROM "temporary_in_app_notification"`);
        this.addSql(`DROP TABLE "temporary_in_app_notification"`);
        this.addSql(`DROP TABLE "hub"`);
        this.addSql(`DROP TABLE "micro_chat"`);
        this.addSql(`DROP TABLE "join_user_hub"`);
        this.addSql(`DROP TABLE "user"`);
        this.addSql(`DROP TABLE "user_device"`);
        this.addSql(`DROP TABLE "password_reset"`);
        this.addSql(`DROP INDEX "IDX_c8772f9bcb1e9f4faaa9c8873d"`);
        this.addSql(`DROP TABLE "invite"`);
        this.addSql(`DROP TABLE "in_app_notification"`);
        this.addSql('PRAGMA main.foreign_key_check')
        this.addSql('PRAGMA foreign_keys=on');
    }

}
