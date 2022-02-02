import { Migration } from '@mikro-orm/migrations';

export class Migration20220202035057 extends Migration {

  async up(): Promise<void> {
    this.addSql('drop table if exists "migrations" cascade;');

    this.addSql('alter table "user" drop constraint "FK_5d250ff0a3f3eba15ff2db819dd";');

    this.addSql('alter table "user_device" drop constraint "FK_bda1afb30d9e3e8fb30b1e90af7";');

    this.addSql('alter table "in_app_notification" drop constraint "FK_601c38c9c36ccb73492dd589a27";');

    this.addSql('alter table "invite" drop constraint "FK_20d407b86806cc510cf8676e7fc";');
    this.addSql('alter table "invite" drop constraint "FK_62a6d64bc66200d81a0208473a7";');
    this.addSql('alter table "invite" drop constraint "FK_fc16ddbaef2a4bf27d46bc78555";');

    this.addSql('alter table "join_user_hub" drop constraint "FK_77f66af41fadebe148e9717499d";');
    this.addSql('alter table "join_user_hub" drop constraint "FK_9b7e78f7bcde729db66f0981bf8";');

    this.addSql('alter table "micro_chat" drop constraint "FK_72c2b3741b8118e0e074aa1cb32";');

    this.addSql('alter table "user" add constraint "user_passwordResetId_foreign" foreign key ("passwordResetId") references "password_reset" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "user_device" add constraint "user_device_userId_foreign" foreign key ("userId") references "user" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "in_app_notification" add constraint "in_app_notification_userId_foreign" foreign key ("userId") references "user" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "hub" drop constraint if exists "hub_latitude_check";');
    this.addSql('alter table "hub" alter column "latitude" type real using ("latitude"::real);');
    this.addSql('alter table "hub" drop constraint if exists "hub_longitude_check";');
    this.addSql('alter table "hub" alter column "longitude" type real using ("longitude"::real);');

    this.addSql('alter table "invite" add constraint "invite_invitersId_foreign" foreign key ("invitersId") references "user" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "invite" add constraint "invite_inviteesId_foreign" foreign key ("inviteesId") references "user" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "invite" add constraint "invite_hubId_foreign" foreign key ("hubId") references "hub" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "join_user_hub" add constraint "join_user_hub_userId_foreign" foreign key ("userId") references "user" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "join_user_hub" add constraint "join_user_hub_hubId_foreign" foreign key ("hubId") references "hub" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "micro_chat" add constraint "micro_chat_hubId_foreign" foreign key ("hubId") references "hub" ("id") on update cascade on delete cascade;');
  }

  async down(): Promise<void> {
    this.addSql('create table "migrations" ("id" serial primary key, "timestamp" int8 not null default null, "name" varchar not null default null);');

    this.addSql('alter table "in_app_notification" drop constraint "in_app_notification_userId_foreign";');

    this.addSql('alter table "invite" drop constraint "invite_invitersId_foreign";');
    this.addSql('alter table "invite" drop constraint "invite_inviteesId_foreign";');
    this.addSql('alter table "invite" drop constraint "invite_hubId_foreign";');

    this.addSql('alter table "join_user_hub" drop constraint "join_user_hub_userId_foreign";');
    this.addSql('alter table "join_user_hub" drop constraint "join_user_hub_hubId_foreign";');

    this.addSql('alter table "micro_chat" drop constraint "micro_chat_hubId_foreign";');

    this.addSql('alter table "user" drop constraint "user_passwordResetId_foreign";');

    this.addSql('alter table "user_device" drop constraint "user_device_userId_foreign";');

    this.addSql('alter table "hub" drop constraint if exists "hub_latitude_check";');
    this.addSql('alter table "hub" alter column "latitude" type float8 using ("latitude"::float8);');
    this.addSql('alter table "hub" drop constraint if exists "hub_longitude_check";');
    this.addSql('alter table "hub" alter column "longitude" type float8 using ("longitude"::float8);');

    this.addSql('alter table "in_app_notification" add constraint "FK_601c38c9c36ccb73492dd589a27" foreign key ("userId") references "user" ("id") on update no action on delete cascade;');

    this.addSql('alter table "invite" add constraint "FK_20d407b86806cc510cf8676e7fc" foreign key ("hubId") references "hub" ("id") on update no action on delete cascade;');
    this.addSql('alter table "invite" add constraint "FK_62a6d64bc66200d81a0208473a7" foreign key ("invitersId") references "user" ("id") on update no action on delete cascade;');
    this.addSql('alter table "invite" add constraint "FK_fc16ddbaef2a4bf27d46bc78555" foreign key ("inviteesId") references "user" ("id") on update no action on delete cascade;');

    this.addSql('alter table "join_user_hub" add constraint "FK_77f66af41fadebe148e9717499d" foreign key ("hubId") references "hub" ("id") on update no action on delete cascade;');
    this.addSql('alter table "join_user_hub" add constraint "FK_9b7e78f7bcde729db66f0981bf8" foreign key ("userId") references "user" ("id") on update no action on delete cascade;');

    this.addSql('alter table "micro_chat" add constraint "FK_72c2b3741b8118e0e074aa1cb32" foreign key ("hubId") references "hub" ("id") on update no action on delete cascade;');

    this.addSql('alter table "user" add constraint "FK_5d250ff0a3f3eba15ff2db819dd" foreign key ("passwordResetId") references "password_reset" ("id") on update no action on delete no action;');

    this.addSql('alter table "user_device" add constraint "FK_bda1afb30d9e3e8fb30b1e90af7" foreign key ("userId") references "user" ("id") on update no action on delete cascade;');
  }

}
