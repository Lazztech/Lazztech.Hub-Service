import {MigrationInterface, QueryRunner} from "typeorm";

export class lastUpdatedOnJoinUserHub1641265549147 implements MigrationInterface {
    name = 'lastUpdatedOnJoinUserHub1641265549147'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "join_user_hub" ADD "lastUpdated" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "join_user_hub" DROP COLUMN "lastUpdated"`);
    }

}
