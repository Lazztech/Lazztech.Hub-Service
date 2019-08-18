import {MigrationInterface, QueryRunner} from "typeorm";

export class InitialSetup1566158250892 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "person" ("id" SERIAL NOT NULL, "name" character varying, CONSTRAINT "PK_5fdaf670315c4b7e70cce85daa3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "person_descriptor" ("id" SERIAL NOT NULL, "descriptor" numeric array, "x" numeric NOT NULL, "y" numeric NOT NULL, "height" numeric NOT NULL, "width" numeric NOT NULL, CONSTRAINT "PK_7719c42e299644100eee87e98f4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "image" ("id" SERIAL NOT NULL, "image" character varying, CONSTRAINT "PK_d6db1ab4ee9ad9dbe86c64e4cc3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "join_person_image" ("personId" integer NOT NULL, "imageId" integer NOT NULL, "personDescriptorId" integer NOT NULL, "locationId" integer, "timestamp" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "REL_51e372b060cabde552c4dcb69a" UNIQUE ("personDescriptorId"), CONSTRAINT "REL_51086f77f13afca5c5df0543eb" UNIQUE ("locationId"), CONSTRAINT "PK_d6bbce6d30d324e5c968d1445be" PRIMARY KEY ("personId", "imageId"))`);
        await queryRunner.query(`CREATE TABLE "location" ("id" SERIAL NOT NULL, "name" character varying, "description" character varying, "latitude" character varying, "longitude" character varying, CONSTRAINT "PK_876d7bdba03c72251ec4c2dc827" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "join_user_location" ("userId" integer NOT NULL, "locationId" integer NOT NULL, CONSTRAINT "PK_ed594d305ba60643ae466a0dbc9" PRIMARY KEY ("userId", "locationId"))`);
        await queryRunner.query(`ALTER TABLE "join_person_image" ADD CONSTRAINT "FK_5547e6bb93fa200931f6afbbb2f" FOREIGN KEY ("personId") REFERENCES "person"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "join_person_image" ADD CONSTRAINT "FK_24b5eaf6da0b73d2bcffcc6a451" FOREIGN KEY ("imageId") REFERENCES "image"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "join_person_image" ADD CONSTRAINT "FK_51e372b060cabde552c4dcb69a4" FOREIGN KEY ("personDescriptorId") REFERENCES "person_descriptor"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "join_person_image" ADD CONSTRAINT "FK_51086f77f13afca5c5df0543ebf" FOREIGN KEY ("locationId") REFERENCES "location"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "join_user_location" ADD CONSTRAINT "FK_225f5a7155bf4e84ac7b852488f" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "join_user_location" ADD CONSTRAINT "FK_ef1e2e914a8bc1218d504e52528" FOREIGN KEY ("locationId") REFERENCES "location"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "join_user_location" DROP CONSTRAINT "FK_ef1e2e914a8bc1218d504e52528"`);
        await queryRunner.query(`ALTER TABLE "join_user_location" DROP CONSTRAINT "FK_225f5a7155bf4e84ac7b852488f"`);
        await queryRunner.query(`ALTER TABLE "join_person_image" DROP CONSTRAINT "FK_51086f77f13afca5c5df0543ebf"`);
        await queryRunner.query(`ALTER TABLE "join_person_image" DROP CONSTRAINT "FK_51e372b060cabde552c4dcb69a4"`);
        await queryRunner.query(`ALTER TABLE "join_person_image" DROP CONSTRAINT "FK_24b5eaf6da0b73d2bcffcc6a451"`);
        await queryRunner.query(`ALTER TABLE "join_person_image" DROP CONSTRAINT "FK_5547e6bb93fa200931f6afbbb2f"`);
        await queryRunner.query(`DROP TABLE "join_user_location"`);
        await queryRunner.query(`DROP TABLE "location"`);
        await queryRunner.query(`DROP TABLE "join_person_image"`);
        await queryRunner.query(`DROP TABLE "image"`);
        await queryRunner.query(`DROP TABLE "person_descriptor"`);
        await queryRunner.query(`DROP TABLE "person"`);
    }

}
