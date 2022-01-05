import {MigrationInterface, QueryRunner} from "typeorm";

export class lastUpdatedOnJoinUserHub1641270340750 implements MigrationInterface {
    name = 'lastUpdatedOnJoinUserHub1641270340750'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "join_user_hub" ADD "lastUpdated" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "join_user_hub" DROP COLUMN "lastUpdated"`);
    }

}
