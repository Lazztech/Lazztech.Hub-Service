import { Migration } from '@mikro-orm/migrations';

export class Migration20230325183306 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "event" add column "minimum_capacity" real null, add column "maximum_capacity" real null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "event" drop column "minimum_capacity";');
    this.addSql('alter table "event" drop column "maximum_capacity";');
  }

}
