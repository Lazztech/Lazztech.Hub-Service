import { Migration } from '@mikro-orm/migrations';

export class Migration20220324024820 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "user" add column "flagged" boolean null, add column "banned" boolean null;');

    this.addSql('alter table "hub" add column "flagged" boolean null, add column "banned" boolean null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "user" drop column "flagged";');
    this.addSql('alter table "user" drop column "banned";');

    this.addSql('alter table "hub" drop column "flagged";');
    this.addSql('alter table "hub" drop column "banned";');
  }

}
