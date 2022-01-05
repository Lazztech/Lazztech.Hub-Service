import {MigrationInterface, QueryRunner} from "typeorm";

export class lastGeofenceEvent1641361224532 implements MigrationInterface {
    name = 'lastGeofenceEvent1641361224532'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "join_user_hub" ADD "lastGeofenceEvent" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "join_user_hub" DROP COLUMN "lastGeofenceEvent"`);
    }

}
