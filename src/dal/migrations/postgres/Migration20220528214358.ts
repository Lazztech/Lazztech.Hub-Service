import { Migration } from '@mikro-orm/migrations';

export class Migration20220528214358 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "event" add column "createdByUserId" int not null;');
    this.addSql('alter table "event" add constraint "event_createdByUserId_foreign" foreign key ("createdByUserId") references "user" ("id") on update cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "event" drop constraint "event_createdByUserId_foreign";');

    this.addSql('alter table "event" drop column "createdByUserId";');
  }

}
