import { Migration } from '@mikro-orm/migrations';

export class Migration20240601210639 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "user_device" add column "web_push_subscription" jsonb null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "user_device" drop column "web_push_subscription";');
  }

}
