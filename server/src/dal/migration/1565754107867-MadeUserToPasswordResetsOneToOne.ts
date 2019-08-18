import {MigrationInterface, QueryRunner} from "typeorm";

export class MadeUserToPasswordResetsOneToOne1565754107867 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "password_reset" DROP CONSTRAINT "FK_05baebe80e9f8fab8207eda250c"`);
        await queryRunner.query(`ALTER TABLE "password_reset" DROP CONSTRAINT "PK_d29fde2fd822326e145ba121ea0"`);
        await queryRunner.query(`ALTER TABLE "password_reset" ADD CONSTRAINT "PK_ec967ba9ee1c687fb331b2cc34d" PRIMARY KEY ("pin")`);
        await queryRunner.query(`ALTER TABLE "password_reset" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "password_reset" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "password_reset" DROP CONSTRAINT "PK_ec967ba9ee1c687fb331b2cc34d"`);
        await queryRunner.query(`ALTER TABLE "password_reset" ADD CONSTRAINT "PK_3ca55e267798a3756a4595d7ddc" PRIMARY KEY ("pin", "id")`);
        await queryRunner.query(`ALTER TABLE "user" ADD "passwordResetId" integer`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_5d250ff0a3f3eba15ff2db819dd" UNIQUE ("passwordResetId")`);
        await queryRunner.query(`ALTER TABLE "password_reset" DROP CONSTRAINT "PK_3ca55e267798a3756a4595d7ddc"`);
        await queryRunner.query(`ALTER TABLE "password_reset" ADD CONSTRAINT "PK_8515e60a2cc41584fa4784f52ce" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "password_reset" DROP COLUMN "pin"`);
        await queryRunner.query(`ALTER TABLE "password_reset" ADD "pin" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_5d250ff0a3f3eba15ff2db819dd" FOREIGN KEY ("passwordResetId") REFERENCES "password_reset"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_5d250ff0a3f3eba15ff2db819dd"`);
        await queryRunner.query(`ALTER TABLE "password_reset" DROP COLUMN "pin"`);
        await queryRunner.query(`ALTER TABLE "password_reset" ADD "pin" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "password_reset" DROP CONSTRAINT "PK_8515e60a2cc41584fa4784f52ce"`);
        await queryRunner.query(`ALTER TABLE "password_reset" ADD CONSTRAINT "PK_3ca55e267798a3756a4595d7ddc" PRIMARY KEY ("pin", "id")`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_5d250ff0a3f3eba15ff2db819dd"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "passwordResetId"`);
        await queryRunner.query(`ALTER TABLE "password_reset" DROP CONSTRAINT "PK_3ca55e267798a3756a4595d7ddc"`);
        await queryRunner.query(`ALTER TABLE "password_reset" ADD CONSTRAINT "PK_ec967ba9ee1c687fb331b2cc34d" PRIMARY KEY ("pin")`);
        await queryRunner.query(`ALTER TABLE "password_reset" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "password_reset" ADD "userId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "password_reset" DROP CONSTRAINT "PK_ec967ba9ee1c687fb331b2cc34d"`);
        await queryRunner.query(`ALTER TABLE "password_reset" ADD CONSTRAINT "PK_d29fde2fd822326e145ba121ea0" PRIMARY KEY ("userId", "pin")`);
        await queryRunner.query(`ALTER TABLE "password_reset" ADD CONSTRAINT "FK_05baebe80e9f8fab8207eda250c" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
