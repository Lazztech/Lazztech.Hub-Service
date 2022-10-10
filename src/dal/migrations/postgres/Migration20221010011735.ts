import { Migration } from '@mikro-orm/migrations';

export class Migration20221010011735 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "join_user_hub" add column "muted" boolean not null default false;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "join_user_hub" drop column "muted";');
  }

}
