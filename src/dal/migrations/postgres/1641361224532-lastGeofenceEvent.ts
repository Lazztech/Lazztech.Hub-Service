import { Migration } from '@mikro-orm/migrations';

export class lastGeofenceEvent1641361224532 extends Migration {
    name = 'lastGeofenceEvent1641361224532'

    public async up(): Promise<void> {
        this.addSql(`ALTER TABLE "join_user_hub" ADD "lastGeofenceEvent" character varying`);
    }

    public async down(): Promise<void> {
        this.addSql(`ALTER TABLE "join_user_hub" DROP COLUMN "lastGeofenceEvent"`);
    }

}
