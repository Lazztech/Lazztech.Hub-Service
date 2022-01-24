import { Migration } from '@mikro-orm/migrations';

export class Migration20220124233621 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table `password_reset` (`id` integer not null primary key autoincrement, `pin` varchar not null);');

    this.addSql('create table `user` (`id` integer not null primary key autoincrement, `shareableId` varchar not null, `firstName` varchar not null, `lastName` varchar not null, `birthdate` varchar null, `description` varchar null, `image` varchar null, `email` varchar not null, `password` varchar not null);');

    this.addSql('create table `user_device` (`id` integer not null primary key autoincrement, `fcmPushUserToken` varchar not null);');
    this.addSql('create unique index `user_device_fcmPushUserToken_unique` on `user_device` (`fcmPushUserToken`);');

    this.addSql('create table `in_app_notification` (`id` integer not null primary key autoincrement, `header` varchar null, `text` varchar not null, `date` varchar not null, `thumbnail` varchar null, `actionLink` varchar null);');

    this.addSql('create table `hub` (`id` integer not null primary key autoincrement, `shareableId` varchar not null, `name` varchar not null, `description` varchar null, `active` integer not null, `image` varchar null, `latitude` varchar null, `longitude` varchar null);');

    this.addSql('create table `invite` (`id` integer not null primary key autoincrement, `accepted` integer not null);');

    this.addSql('create table `join_user_hub` (`userId` integer not null, `hubId` integer not null, `isOwner` integer not null, `starred` integer not null, `isPresent` integer not null, `lastGeofenceEvent` varchar null, `lastUpdated` varchar null, primary key (`userId`, `hubId`));');
    this.addSql('create index `join_user_hub_userId_index` on `join_user_hub` (`userId`);');
    this.addSql('create index `join_user_hub_hubId_index` on `join_user_hub` (`hubId`);');

    this.addSql('create table `micro_chat` (`id` integer not null primary key autoincrement, `text` varchar not null);');

    this.addSql('alter table `user` add column `passwordResetId` integer null;');
    this.addSql('create index `user_passwordResetId_index` on `user` (`passwordResetId`);');
    this.addSql('create unique index `user_passwordResetId_unique` on `user` (`passwordResetId`);');

    this.addSql('alter table `user_device` add column `userId` integer null;');
    this.addSql('create index `user_device_userId_index` on `user_device` (`userId`);');

    this.addSql('alter table `in_app_notification` add column `userId` integer null;');
    this.addSql('create index `in_app_notification_userId_index` on `in_app_notification` (`userId`);');

    this.addSql('alter table `invite` add column `invitersId` integer null;');
    this.addSql('alter table `invite` add column `inviteesId` integer null;');
    this.addSql('alter table `invite` add column `hubId` integer null;');
    this.addSql('create index `invite_invitersId_index` on `invite` (`invitersId`);');
    this.addSql('create index `invite_inviteesId_index` on `invite` (`inviteesId`);');
    this.addSql('create index `invite_hubId_index` on `invite` (`hubId`);');

    this.addSql('alter table `micro_chat` add column `hubId` integer null;');
    this.addSql('create index `micro_chat_hubId_index` on `micro_chat` (`hubId`);');

    this.addSql('create unique index `invite_invitersId_inviteesId_hubId_unique` on `invite` (`invitersId`, `inviteesId`, `hubId`);');
  }

}
