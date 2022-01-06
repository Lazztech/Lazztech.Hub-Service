import { Migration } from '@mikro-orm/migrations';

export class initialMigration1639451178833 extends Migration {
    name = 'initialMigration1639451178833'

    public async up(): Promise<void> {
        this.addSql(`CREATE TABLE "in_app_notification" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "header" character varying, "text" character varying NOT NULL, "date" character varying NOT NULL, "thumbnail" character varying, "actionLink" character varying, CONSTRAINT "PK_9c57597f8e042ab80df73847de4" PRIMARY KEY ("id"))`);
        this.addSql(`CREATE TABLE "invite" ("id" SERIAL NOT NULL, "invitersId" integer NOT NULL, "inviteesId" integer NOT NULL, "hubId" integer NOT NULL, "accepted" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_fc9fa190e5a3c5d80604a4f63e1" PRIMARY KEY ("id"))`);
        this.addSql(`CREATE UNIQUE INDEX "IDX_c8772f9bcb1e9f4faaa9c8873d" ON "invite" ("invitersId", "inviteesId", "hubId") `);
        this.addSql(`CREATE TABLE "password_reset" ("id" SERIAL NOT NULL, "pin" character varying NOT NULL, CONSTRAINT "PK_8515e60a2cc41584fa4784f52ce" PRIMARY KEY ("id"))`);
        this.addSql(`CREATE TABLE "user_device" ("id" SERIAL NOT NULL, "fcmPushUserToken" character varying NOT NULL, "userId" integer NOT NULL, CONSTRAINT "UQ_9fa10355d40f3311b221b15c04c" UNIQUE ("fcmPushUserToken"), CONSTRAINT "PK_0232591a0b48e1eb92f3ec5d0d1" PRIMARY KEY ("id"))`);
        this.addSql(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "birthdate" character varying, "description" character varying, "image" character varying, "email" character varying NOT NULL, "password" character varying NOT NULL, "passwordResetId" integer, CONSTRAINT "REL_5d250ff0a3f3eba15ff2db819d" UNIQUE ("passwordResetId"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        this.addSql(`CREATE TABLE "join_user_hub" ("userId" integer NOT NULL, "hubId" integer NOT NULL, "isOwner" boolean NOT NULL, "starred" boolean NOT NULL DEFAULT false, "isPresent" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_712e6729d6544114c10cd4a2fa7" PRIMARY KEY ("userId", "hubId"))`);
        this.addSql(`CREATE TABLE "micro_chat" ("id" SERIAL NOT NULL, "hubId" integer NOT NULL, "text" character varying NOT NULL, CONSTRAINT "PK_83755b74d7fdaadef8a9bea3667" PRIMARY KEY ("id"))`);
        this.addSql(`CREATE TABLE "hub" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying, "active" boolean NOT NULL DEFAULT false, "image" character varying, "latitude" double precision, "longitude" double precision, CONSTRAINT "PK_3e44a0e97127ddd25d60430b924" PRIMARY KEY ("id"))`);
        this.addSql(`ALTER TABLE "in_app_notification" ADD CONSTRAINT "FK_601c38c9c36ccb73492dd589a27" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        this.addSql(`ALTER TABLE "invite" ADD CONSTRAINT "FK_62a6d64bc66200d81a0208473a7" FOREIGN KEY ("invitersId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        this.addSql(`ALTER TABLE "invite" ADD CONSTRAINT "FK_fc16ddbaef2a4bf27d46bc78555" FOREIGN KEY ("inviteesId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        this.addSql(`ALTER TABLE "invite" ADD CONSTRAINT "FK_20d407b86806cc510cf8676e7fc" FOREIGN KEY ("hubId") REFERENCES "hub"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        this.addSql(`ALTER TABLE "user_device" ADD CONSTRAINT "FK_bda1afb30d9e3e8fb30b1e90af7" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        this.addSql(`ALTER TABLE "user" ADD CONSTRAINT "FK_5d250ff0a3f3eba15ff2db819dd" FOREIGN KEY ("passwordResetId") REFERENCES "password_reset"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        this.addSql(`ALTER TABLE "join_user_hub" ADD CONSTRAINT "FK_9b7e78f7bcde729db66f0981bf8" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        this.addSql(`ALTER TABLE "join_user_hub" ADD CONSTRAINT "FK_77f66af41fadebe148e9717499d" FOREIGN KEY ("hubId") REFERENCES "hub"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        this.addSql(`ALTER TABLE "micro_chat" ADD CONSTRAINT "FK_72c2b3741b8118e0e074aa1cb32" FOREIGN KEY ("hubId") REFERENCES "hub"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(): Promise<void> {
        this.addSql(`ALTER TABLE "micro_chat" DROP CONSTRAINT "FK_72c2b3741b8118e0e074aa1cb32"`);
        this.addSql(`ALTER TABLE "join_user_hub" DROP CONSTRAINT "FK_77f66af41fadebe148e9717499d"`);
        this.addSql(`ALTER TABLE "join_user_hub" DROP CONSTRAINT "FK_9b7e78f7bcde729db66f0981bf8"`);
        this.addSql(`ALTER TABLE "user" DROP CONSTRAINT "FK_5d250ff0a3f3eba15ff2db819dd"`);
        this.addSql(`ALTER TABLE "user_device" DROP CONSTRAINT "FK_bda1afb30d9e3e8fb30b1e90af7"`);
        this.addSql(`ALTER TABLE "invite" DROP CONSTRAINT "FK_20d407b86806cc510cf8676e7fc"`);
        this.addSql(`ALTER TABLE "invite" DROP CONSTRAINT "FK_fc16ddbaef2a4bf27d46bc78555"`);
        this.addSql(`ALTER TABLE "invite" DROP CONSTRAINT "FK_62a6d64bc66200d81a0208473a7"`);
        this.addSql(`ALTER TABLE "in_app_notification" DROP CONSTRAINT "FK_601c38c9c36ccb73492dd589a27"`);
        this.addSql(`DROP TABLE "hub"`);
        this.addSql(`DROP TABLE "micro_chat"`);
        this.addSql(`DROP TABLE "join_user_hub"`);
        this.addSql(`DROP TABLE "user"`);
        this.addSql(`DROP TABLE "user_device"`);
        this.addSql(`DROP TABLE "password_reset"`);
        this.addSql(`DROP INDEX "IDX_c8772f9bcb1e9f4faaa9c8873d"`);
        this.addSql(`DROP TABLE "invite"`);
        this.addSql(`DROP TABLE "in_app_notification"`);
    }

}
