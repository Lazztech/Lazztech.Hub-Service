import {MigrationInterface, QueryRunner} from "typeorm";

export class AddedHubAndJoinUserHub1567142432107 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "hub" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "image" character varying NOT NULL, CONSTRAINT "PK_3e44a0e97127ddd25d60430b924" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "join_user_hub" ("userId" integer NOT NULL, "hubId" integer NOT NULL, "isOwner" boolean NOT NULL, CONSTRAINT "PK_712e6729d6544114c10cd4a2fa7" PRIMARY KEY ("userId", "hubId"))`);
        await queryRunner.query(`ALTER TABLE "join_user_hub" ADD CONSTRAINT "FK_9b7e78f7bcde729db66f0981bf8" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "join_user_hub" ADD CONSTRAINT "FK_77f66af41fadebe148e9717499d" FOREIGN KEY ("hubId") REFERENCES "hub"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "join_user_hub" DROP CONSTRAINT "FK_77f66af41fadebe148e9717499d"`);
        await queryRunner.query(`ALTER TABLE "join_user_hub" DROP CONSTRAINT "FK_9b7e78f7bcde729db66f0981bf8"`);
        await queryRunner.query(`DROP TABLE "join_user_hub"`);
        await queryRunner.query(`DROP TABLE "hub"`);
    }

}
