import {MigrationInterface, QueryRunner} from "typeorm";

export class ShareableIdsUpdatedNONNULLABLE1639787690789 implements MigrationInterface {
    name = 'ShareableIdsUpdatedNONNULLABLE1639787690789'

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`ALTER TABLE "hub" ALTER COLUMN "shareableId" SET NOT NULL`);
      await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "shareableId" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "hub" ALTER COLUMN "shareableId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "shareableId" DROP NOT NULL`);
    }

}
