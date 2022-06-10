import { Migration } from '@mikro-orm/migrations';

export class Migration20220610040640 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "event" add column "location_label" varchar(255) null;');
    this.addSql('alter table "event" drop column "all_day";');
  }

  async down(): Promise<void> {
    this.addSql('alter table "event" add column "all_day" boolean null;');
    this.addSql('alter table "event" drop column "location_label";');
  }

}
