import {MigrationInterface, QueryRunner} from "typeorm";

export class InitialSetup1566158442837 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "in_app_notification" ("id" SERIAL NOT NULL, "text" character varying NOT NULL, "date" character varying NOT NULL, "thumbnail" character varying, "actionLink" character varying, CONSTRAINT "PK_9c57597f8e042ab80df73847de4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "join_user_in_app_notifications" ("userId" integer NOT NULL, "inAppNotificationId" integer NOT NULL, CONSTRAINT "PK_88fdc209e87a69b0a9024d37dd6" PRIMARY KEY ("userId", "inAppNotificationId"))`);
        await queryRunner.query(`CREATE TABLE "person" ("id" SERIAL NOT NULL, "name" character varying, CONSTRAINT "PK_5fdaf670315c4b7e70cce85daa3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "person_descriptor" ("id" SERIAL NOT NULL, "descriptor" numeric array, "x" numeric NOT NULL, "y" numeric NOT NULL, "height" numeric NOT NULL, "width" numeric NOT NULL, CONSTRAINT "PK_7719c42e299644100eee87e98f4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "image" ("id" SERIAL NOT NULL, "image" character varying, CONSTRAINT "PK_d6db1ab4ee9ad9dbe86c64e4cc3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "join_person_image" ("personId" integer NOT NULL, "imageId" integer NOT NULL, "personDescriptorId" integer NOT NULL, "locationId" integer, "timestamp" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "REL_51e372b060cabde552c4dcb69a" UNIQUE ("personDescriptorId"), CONSTRAINT "REL_51086f77f13afca5c5df0543eb" UNIQUE ("locationId"), CONSTRAINT "PK_d6bbce6d30d324e5c968d1445be" PRIMARY KEY ("personId", "imageId"))`);
        await queryRunner.query(`CREATE TABLE "location" ("id" SERIAL NOT NULL, "name" character varying, "description" character varying, "latitude" character varying, "longitude" character varying, CONSTRAINT "PK_876d7bdba03c72251ec4c2dc827" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "join_user_location" ("userId" integer NOT NULL, "locationId" integer NOT NULL, CONSTRAINT "PK_ed594d305ba60643ae466a0dbc9" PRIMARY KEY ("userId", "locationId"))`);
        await queryRunner.query(`CREATE TABLE "password_reset" ("id" SERIAL NOT NULL, "pin" character varying NOT NULL, "timestamp" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "PK_8515e60a2cc41584fa4784f52ce" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_device" ("id" SERIAL NOT NULL, "fcmPushUserToken" text NOT NULL, "userId" integer NOT NULL, CONSTRAINT "UQ_9fa10355d40f3311b221b15c04c" UNIQUE ("fcmPushUserToken"), CONSTRAINT "PK_0232591a0b48e1eb92f3ec5d0d1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "email" text NOT NULL, "password" character varying NOT NULL, "passwordResetId" integer, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "REL_5d250ff0a3f3eba15ff2db819d" UNIQUE ("passwordResetId"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "join_user_group" ("userId" integer NOT NULL, "locationId" integer NOT NULL, "groupId" integer, CONSTRAINT "PK_02c648cd4e69f7f2326fd9276fd" PRIMARY KEY ("userId", "locationId"))`);
        await queryRunner.query(`CREATE TABLE "group" ("id" SERIAL NOT NULL, "name" character varying, "description" character varying, CONSTRAINT "PK_256aa0fda9b1de1a73ee0b7106b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "invite" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, CONSTRAINT "PK_fc9fa190e5a3c5d80604a4f63e1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "join_user_in_app_notifications" ADD CONSTRAINT "FK_d342396ba51c5ed48dfef10fe28" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "join_user_in_app_notifications" ADD CONSTRAINT "FK_5a574454bde0417279789491071" FOREIGN KEY ("inAppNotificationId") REFERENCES "in_app_notification"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "join_person_image" ADD CONSTRAINT "FK_5547e6bb93fa200931f6afbbb2f" FOREIGN KEY ("personId") REFERENCES "person"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "join_person_image" ADD CONSTRAINT "FK_24b5eaf6da0b73d2bcffcc6a451" FOREIGN KEY ("imageId") REFERENCES "image"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "join_person_image" ADD CONSTRAINT "FK_51e372b060cabde552c4dcb69a4" FOREIGN KEY ("personDescriptorId") REFERENCES "person_descriptor"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "join_person_image" ADD CONSTRAINT "FK_51086f77f13afca5c5df0543ebf" FOREIGN KEY ("locationId") REFERENCES "location"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "join_user_location" ADD CONSTRAINT "FK_225f5a7155bf4e84ac7b852488f" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "join_user_location" ADD CONSTRAINT "FK_ef1e2e914a8bc1218d504e52528" FOREIGN KEY ("locationId") REFERENCES "location"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_device" ADD CONSTRAINT "FK_bda1afb30d9e3e8fb30b1e90af7" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_5d250ff0a3f3eba15ff2db819dd" FOREIGN KEY ("passwordResetId") REFERENCES "password_reset"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "join_user_group" ADD CONSTRAINT "FK_d231827af7b3b889d62f6ebb3e5" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "join_user_group" ADD CONSTRAINT "FK_ebc9c865bc14710e2fd94b26b89" FOREIGN KEY ("groupId") REFERENCES "group"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "join_user_group" DROP CONSTRAINT "FK_ebc9c865bc14710e2fd94b26b89"`);
        await queryRunner.query(`ALTER TABLE "join_user_group" DROP CONSTRAINT "FK_d231827af7b3b889d62f6ebb3e5"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_5d250ff0a3f3eba15ff2db819dd"`);
        await queryRunner.query(`ALTER TABLE "user_device" DROP CONSTRAINT "FK_bda1afb30d9e3e8fb30b1e90af7"`);
        await queryRunner.query(`ALTER TABLE "join_user_location" DROP CONSTRAINT "FK_ef1e2e914a8bc1218d504e52528"`);
        await queryRunner.query(`ALTER TABLE "join_user_location" DROP CONSTRAINT "FK_225f5a7155bf4e84ac7b852488f"`);
        await queryRunner.query(`ALTER TABLE "join_person_image" DROP CONSTRAINT "FK_51086f77f13afca5c5df0543ebf"`);
        await queryRunner.query(`ALTER TABLE "join_person_image" DROP CONSTRAINT "FK_51e372b060cabde552c4dcb69a4"`);
        await queryRunner.query(`ALTER TABLE "join_person_image" DROP CONSTRAINT "FK_24b5eaf6da0b73d2bcffcc6a451"`);
        await queryRunner.query(`ALTER TABLE "join_person_image" DROP CONSTRAINT "FK_5547e6bb93fa200931f6afbbb2f"`);
        await queryRunner.query(`ALTER TABLE "join_user_in_app_notifications" DROP CONSTRAINT "FK_5a574454bde0417279789491071"`);
        await queryRunner.query(`ALTER TABLE "join_user_in_app_notifications" DROP CONSTRAINT "FK_d342396ba51c5ed48dfef10fe28"`);
        await queryRunner.query(`DROP TABLE "invite"`);
        await queryRunner.query(`DROP TABLE "group"`);
        await queryRunner.query(`DROP TABLE "join_user_group"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "user_device"`);
        await queryRunner.query(`DROP TABLE "password_reset"`);
        await queryRunner.query(`DROP TABLE "join_user_location"`);
        await queryRunner.query(`DROP TABLE "location"`);
        await queryRunner.query(`DROP TABLE "join_person_image"`);
        await queryRunner.query(`DROP TABLE "image"`);
        await queryRunner.query(`DROP TABLE "person_descriptor"`);
        await queryRunner.query(`DROP TABLE "person"`);
        await queryRunner.query(`DROP TABLE "join_user_in_app_notifications"`);
        await queryRunner.query(`DROP TABLE "in_app_notification"`);
    }

}
