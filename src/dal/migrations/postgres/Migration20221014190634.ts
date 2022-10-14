import { Migration } from '@mikro-orm/migrations';

export class Migration20221014190634 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "event" add column "hub_id" int null;');
    this.addSql('alter table "event" add constraint "event_hub_id_foreign" foreign key ("hub_id") references "hub" ("id") on update cascade on delete set null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "event" drop constraint "event_hub_id_foreign";');

    this.addSql('alter table "event" drop column "hub_id";');
  }

}
