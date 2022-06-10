import { Migration } from '@mikro-orm/migrations';

export class Migration20220527022618 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "event" ("id" serial primary key, "shareableId" varchar(255) not null, "name" varchar(255) not null, "description" varchar(255) null, "all_day" boolean null, "start_date_time" varchar(255) null, "end_date_time" varchar(255) null, "image" varchar(255) null, "latitude" real null, "longitude" real null, "flagged" boolean null, "banned" boolean null);');

    this.addSql('create table "join_user_event" ("userId" int not null, "eventId" int not null, "isPresent" boolean not null default false, "rsvp" varchar(255) null, "lastGeofenceEvent" varchar(255) null, "lastUpdated" varchar(255) null);');
    this.addSql('alter table "join_user_event" add constraint "join_user_event_pkey" primary key ("userId", "eventId");');

    this.addSql('alter table "join_user_event" add constraint "join_user_event_userId_foreign" foreign key ("userId") references "user" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "join_user_event" add constraint "join_user_event_eventId_foreign" foreign key ("eventId") references "event" ("id") on update cascade on delete cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "join_user_event" drop constraint "join_user_event_eventId_foreign";');

    this.addSql('drop table if exists "event" cascade;');

    this.addSql('drop table if exists "join_user_event" cascade;');
  }

}
