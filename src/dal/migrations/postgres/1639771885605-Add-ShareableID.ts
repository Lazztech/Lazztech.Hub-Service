import { Migration } from '@mikro-orm/migrations';

export class AddShareableID1639771885605 extends Migration {
    name = 'AddShareableID1639771885605'

    public async up(): Promise<void> {
        this.addSql(`ALTER TABLE "user" ADD "shareableId" character varying`);
        this.addSql(`ALTER TABLE "hub" ADD "shareableId" character varying`);
    }

    public async down(): Promise<void> {
        this.addSql(`ALTER TABLE "hub" DROP COLUMN "shareableId"`);
        this.addSql(`ALTER TABLE "user" DROP COLUMN "shareableId"`);
    }

}
