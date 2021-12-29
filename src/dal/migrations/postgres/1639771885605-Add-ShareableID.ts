import {MigrationInterface, QueryRunner} from "typeorm";

export class AddShareableID1639771885605 implements MigrationInterface {
    name = 'AddShareableID1639771885605'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "shareableId" character varying`);
        await queryRunner.query(`ALTER TABLE "hub" ADD "shareableId" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "hub" DROP COLUMN "shareableId"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "shareableId"`);
    }

}
