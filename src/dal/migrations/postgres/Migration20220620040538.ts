import { Migration } from '@mikro-orm/migrations';

export class Migration20220620040538 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "hub" add column "location_label" varchar(255) null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "hub" drop column "location_label";');
  }

}
