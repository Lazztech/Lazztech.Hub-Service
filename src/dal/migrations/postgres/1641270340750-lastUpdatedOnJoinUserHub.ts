import { Migration } from '@mikro-orm/migrations';

export class lastUpdatedOnJoinUserHub1641270340750 extends Migration {
    name = 'lastUpdatedOnJoinUserHub1641270340750'

    public async up(): Promise<void> {
        this.addSql(`ALTER TABLE "join_user_hub" ADD "lastUpdated" character varying`);
    }

    public async down(): Promise<void> {
        this.addSql(`ALTER TABLE "join_user_hub" DROP COLUMN "lastUpdated"`);
    }

}
