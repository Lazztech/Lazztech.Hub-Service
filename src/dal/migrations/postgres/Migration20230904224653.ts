import { Migration } from '@mikro-orm/migrations';

export class Migration20230904224653 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "hub" add column "url" varchar(255) null;');

    this.addSql('alter table "event" add column "url" varchar(255) null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "hub" drop column "url";');

    this.addSql('alter table "event" drop column "url";');
  }

}
