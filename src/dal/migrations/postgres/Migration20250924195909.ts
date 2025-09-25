import { Migration } from '@mikro-orm/migrations';

export class Migration20250924195909 extends Migration {

  async up(): Promise<void> {
    this.addSql('drop table if exists "micro_chat" cascade;');
  }

  async down(): Promise<void> {
    this.addSql('create table "micro_chat" ("id" serial primary key, "hubId" int not null, "text" varchar(255) not null);');

    this.addSql('alter table "micro_chat" add constraint "micro_chat_hubId_foreign" foreign key ("hubId") references "hub" ("id") on update cascade on delete cascade;');
  }

}
