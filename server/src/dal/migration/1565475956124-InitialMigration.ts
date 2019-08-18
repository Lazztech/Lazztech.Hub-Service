import {MigrationInterface, QueryRunner} from "typeorm";

export class InitialMigration1565475956124 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "in_app_notification" ("id" SERIAL NOT NULL, "text" character varying NOT NULL, "date" character varying NOT NULL, "thumbnail" character varying, "actionLink" character varying, CONSTRAINT "PK_9c57597f8e042ab80df73847de4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "join_user_in_app_notifications" ("userId" integer NOT NULL, "inAppNotificationId" integer NOT NULL, CONSTRAINT "PK_88fdc209e87a69b0a9024d37dd6" PRIMARY KEY ("userId", "inAppNotificationId"))`);
        await queryRunner.query(`CREATE TABLE "password_reset" ("userId" integer NOT NULL, "pin" integer NOT NULL, "timestamp" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "PK_d29fde2fd822326e145ba121ea0" PRIMARY KEY ("userId", "pin"))`);
        await queryRunner.query(`CREATE TABLE "user_device" ("id" SERIAL NOT NULL, "fcmPushUserToken" text NOT NULL, "userId" integer NOT NULL, CONSTRAINT "UQ_9fa10355d40f3311b221b15c04c" UNIQUE ("fcmPushUserToken"), CONSTRAINT "PK_0232591a0b48e1eb92f3ec5d0d1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "email" text NOT NULL, "password" character varying NOT NULL, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "join_user_group" ("userId" integer NOT NULL, "locationId" integer NOT NULL, "groupId" integer, CONSTRAINT "PK_02c648cd4e69f7f2326fd9276fd" PRIMARY KEY ("userId", "locationId"))`);
        await queryRunner.query(`CREATE TABLE "group" ("id" SERIAL NOT NULL, "name" character varying, "description" character varying, CONSTRAINT "PK_256aa0fda9b1de1a73ee0b7106b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "invite" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, CONSTRAINT "PK_fc9fa190e5a3c5d80604a4f63e1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "join_user_in_app_notifications" ADD CONSTRAINT "FK_d342396ba51c5ed48dfef10fe28" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "join_user_in_app_notifications" ADD CONSTRAINT "FK_5a574454bde0417279789491071" FOREIGN KEY ("inAppNotificationId") REFERENCES "in_app_notification"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "password_reset" ADD CONSTRAINT "FK_05baebe80e9f8fab8207eda250c" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_device" ADD CONSTRAINT "FK_bda1afb30d9e3e8fb30b1e90af7" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "join_user_group" ADD CONSTRAINT "FK_d231827af7b3b889d62f6ebb3e5" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "join_user_group" ADD CONSTRAINT "FK_ebc9c865bc14710e2fd94b26b89" FOREIGN KEY ("groupId") REFERENCES "group"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "join_user_group" DROP CONSTRAINT "FK_ebc9c865bc14710e2fd94b26b89"`);
        await queryRunner.query(`ALTER TABLE "join_user_group" DROP CONSTRAINT "FK_d231827af7b3b889d62f6ebb3e5"`);
        await queryRunner.query(`ALTER TABLE "user_device" DROP CONSTRAINT "FK_bda1afb30d9e3e8fb30b1e90af7"`);
        await queryRunner.query(`ALTER TABLE "password_reset" DROP CONSTRAINT "FK_05baebe80e9f8fab8207eda250c"`);
        await queryRunner.query(`ALTER TABLE "join_user_in_app_notifications" DROP CONSTRAINT "FK_5a574454bde0417279789491071"`);
        await queryRunner.query(`ALTER TABLE "join_user_in_app_notifications" DROP CONSTRAINT "FK_d342396ba51c5ed48dfef10fe28"`);
        await queryRunner.query(`DROP TABLE "invite"`);
        await queryRunner.query(`DROP TABLE "group"`);
        await queryRunner.query(`DROP TABLE "join_user_group"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "user_device"`);
        await queryRunner.query(`DROP TABLE "password_reset"`);
        await queryRunner.query(`DROP TABLE "join_user_in_app_notifications"`);
        await queryRunner.query(`DROP TABLE "in_app_notification"`);
    }

}
