import { Migration } from '@mikro-orm/migrations';

export class Migration20230618202310 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "join_hub_file" ("fileId" int not null, "hubId" int not null, "userId" int not null, constraint "join_hub_file_pkey" primary key ("fileId", "hubId"));');

    this.addSql('create table "join_event_file" ("fileId" int not null, "eventId" int not null, "userId" int not null, constraint "join_event_file_pkey" primary key ("fileId", "eventId"));');

    this.addSql('alter table "join_hub_file" add constraint "join_hub_file_fileId_foreign" foreign key ("fileId") references "file" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "join_hub_file" add constraint "join_hub_file_hubId_foreign" foreign key ("hubId") references "hub" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "join_hub_file" add constraint "join_hub_file_userId_foreign" foreign key ("userId") references "user" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "join_event_file" add constraint "join_event_file_fileId_foreign" foreign key ("fileId") references "file" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "join_event_file" add constraint "join_event_file_eventId_foreign" foreign key ("eventId") references "event" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "join_event_file" add constraint "join_event_file_userId_foreign" foreign key ("userId") references "user" ("id") on update cascade on delete cascade;');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "join_hub_file" cascade;');

    this.addSql('drop table if exists "join_event_file" cascade;');
  }

}
