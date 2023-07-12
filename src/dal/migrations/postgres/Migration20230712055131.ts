import { Migration } from '@mikro-orm/migrations';

export class Migration20230712055131 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "file" add column "banned" boolean null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "file" drop column "banned";');
  }

}
