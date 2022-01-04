import {MigrationInterface, QueryRunner} from "typeorm";

export class lastUpdatedOnJoinUserHub1641270345782 implements MigrationInterface {
    name = 'lastUpdatedOnJoinUserHub1641270345782'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "temporary_join_user_hub" ("userId" integer NOT NULL, "hubId" integer NOT NULL, "isOwner" boolean NOT NULL, "starred" boolean NOT NULL DEFAULT (0), "isPresent" boolean NOT NULL DEFAULT (0), "lastUpdated" varchar, CONSTRAINT "FK_9b7e78f7bcde729db66f0981bf8" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_77f66af41fadebe148e9717499d" FOREIGN KEY ("hubId") REFERENCES "hub" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, PRIMARY KEY ("userId", "hubId"))`);
        await queryRunner.query(`INSERT INTO "temporary_join_user_hub"("userId", "hubId", "isOwner", "starred", "isPresent") SELECT "userId", "hubId", "isOwner", "starred", "isPresent" FROM "join_user_hub"`);
        await queryRunner.query(`DROP TABLE "join_user_hub"`);
        await queryRunner.query(`ALTER TABLE "temporary_join_user_hub" RENAME TO "join_user_hub"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "join_user_hub" RENAME TO "temporary_join_user_hub"`);
        await queryRunner.query(`CREATE TABLE "join_user_hub" ("userId" integer NOT NULL, "hubId" integer NOT NULL, "isOwner" boolean NOT NULL, "starred" boolean NOT NULL DEFAULT (0), "isPresent" boolean NOT NULL DEFAULT (0), CONSTRAINT "FK_9b7e78f7bcde729db66f0981bf8" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_77f66af41fadebe148e9717499d" FOREIGN KEY ("hubId") REFERENCES "hub" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, PRIMARY KEY ("userId", "hubId"))`);
        await queryRunner.query(`INSERT INTO "join_user_hub"("userId", "hubId", "isOwner", "starred", "isPresent") SELECT "userId", "hubId", "isOwner", "starred", "isPresent" FROM "temporary_join_user_hub"`);
        await queryRunner.query(`DROP TABLE "temporary_join_user_hub"`);
    }

}
