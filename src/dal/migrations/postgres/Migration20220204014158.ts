import { Migration } from '@mikro-orm/migrations';

export class Migration20220204014158 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "user" add column "last_online" varchar(255) null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "user" drop column "last_online";');
  }

}
