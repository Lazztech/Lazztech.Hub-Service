import { Migration } from '@mikro-orm/migrations';

export class Migration20220124234318 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "password_reset" ("id" serial primary key, "pin" varchar(255) not null);');

    this.addSql('create table "user" ("id" serial primary key, "shareableId" varchar(255) not null, "firstName" varchar(255) not null, "lastName" varchar(255) not null, "birthdate" varchar(255) null, "description" varchar(255) null, "image" varchar(255) null, "email" varchar(255) not null, "password" varchar(255) not null, "passwordResetId" int4 null);');
    this.addSql('alter table "user" add constraint "user_passwordResetId_unique" unique ("passwordResetId");');

    this.addSql('create table "user_device" ("id" serial primary key, "fcmPushUserToken" varchar(255) not null, "userId" int4 not null);');
    this.addSql('alter table "user_device" add constraint "user_device_fcmPushUserToken_unique" unique ("fcmPushUserToken");');

    this.addSql('create table "in_app_notification" ("id" serial primary key, "header" varchar(255) null, "text" varchar(255) not null, "date" varchar(255) not null, "thumbnail" varchar(255) null, "actionLink" varchar(255) null, "userId" int4 not null);');

    this.addSql('create table "hub" ("id" serial primary key, "shareableId" varchar(255) not null, "name" varchar(255) not null, "description" varchar(255) null, "active" bool not null, "image" varchar(255) null, "latitude" float null, "longitude" float null);');

    this.addSql('create table "invite" ("id" serial primary key, "accepted" bool not null, "invitersId" int4 not null, "inviteesId" int4 not null, "hubId" int4 not null);');

    this.addSql('create table "join_user_hub" ("userId" int4 not null, "hubId" int4 not null, "isOwner" bool not null, "starred" bool not null, "isPresent" bool not null, "lastGeofenceEvent" varchar(255) null, "lastUpdated" varchar(255) null);');
    this.addSql('alter table "join_user_hub" add constraint "join_user_hub_pkey" primary key ("userId", "hubId");');

    this.addSql('create table "micro_chat" ("id" serial primary key, "hubId" int4 not null, "text" varchar(255) not null);');

    this.addSql('alter table "user" add constraint "user_passwordResetId_foreign" foreign key ("passwordResetId") references "password_reset" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "user_device" add constraint "user_device_userId_foreign" foreign key ("userId") references "user" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "in_app_notification" add constraint "in_app_notification_userId_foreign" foreign key ("userId") references "user" ("id") on update cascade on delete CASCADE;');

    this.addSql('alter table "invite" add constraint "invite_invitersId_foreign" foreign key ("invitersId") references "user" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "invite" add constraint "invite_inviteesId_foreign" foreign key ("inviteesId") references "user" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "invite" add constraint "invite_hubId_foreign" foreign key ("hubId") references "hub" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "join_user_hub" add constraint "join_user_hub_userId_foreign" foreign key ("userId") references "user" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "join_user_hub" add constraint "join_user_hub_hubId_foreign" foreign key ("hubId") references "hub" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "micro_chat" add constraint "micro_chat_hubId_foreign" foreign key ("hubId") references "hub" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "invite" add constraint "invite_invitersId_inviteesId_hubId_unique" unique ("invitersId", "inviteesId", "hubId");');
  }

}
