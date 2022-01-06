import { Migration } from '@mikro-orm/migrations';

export class ShareableIdsUpdatedNONNULLABLE1639787690789 extends Migration {
    name = 'ShareableIdsUpdatedNONNULLABLE1639787690789'

    public async up(): Promise<void> {
      this.addSql(`ALTER TABLE "hub" ALTER COLUMN "shareableId" SET NOT NULL`);
      this.addSql(`ALTER TABLE "user" ALTER COLUMN "shareableId" SET NOT NULL`);
    }

    public async down(): Promise<void> {
        this.addSql(`ALTER TABLE "hub" ALTER COLUMN "shareableId" DROP NOT NULL`);
        this.addSql(`ALTER TABLE "user" ALTER COLUMN "shareableId" DROP NOT NULL`);
    }

}
