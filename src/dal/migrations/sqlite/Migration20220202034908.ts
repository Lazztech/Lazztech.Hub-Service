import { Migration } from '@mikro-orm/migrations';

export class Migration20220202034908 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table `password_reset` (`id` integer not null primary key autoincrement, `pin` text not null);');

    this.addSql('create table `user` (`id` integer not null primary key autoincrement, `shareableId` text not null, `firstName` text not null, `lastName` text not null, `birthdate` text null, `description` text null, `image` text null, `email` text not null, `password` text not null, `passwordResetId` integer null, constraint `user_passwordResetId_foreign` foreign key(`passwordResetId`) references `password_reset`(`id`) on delete cascade on update cascade);');
    this.addSql('create index `user_passwordResetId_index` on `user` (`passwordResetId`);');
    this.addSql('create unique index `REL_5d250ff0a3f3eba15ff2db819d` on `user` (`passwordResetId`);');

    this.addSql('create table `user_device` (`id` integer not null primary key autoincrement, `fcmPushUserToken` text not null, `userId` integer not null, constraint `user_device_userId_foreign` foreign key(`userId`) references `user`(`id`) on delete cascade on update cascade);');
    this.addSql('create unique index `UQ_9fa10355d40f3311b221b15c04c` on `user_device` (`fcmPushUserToken`);');
    this.addSql('create index `user_device_userId_index` on `user_device` (`userId`);');

    this.addSql('create table `in_app_notification` (`id` integer not null primary key autoincrement, `header` text null, `text` text not null, `date` text not null, `thumbnail` text null, `actionLink` text null, `userId` integer not null, constraint `in_app_notification_userId_foreign` foreign key(`userId`) references `user`(`id`) on delete cascade on update cascade);');
    this.addSql('create index `in_app_notification_userId_index` on `in_app_notification` (`userId`);');

    this.addSql('create table `hub` (`id` integer not null primary key autoincrement, `shareableId` text not null, `name` text not null, `description` text null, `active` integer not null default false, `image` text null, `latitude` real null, `longitude` real null);');

    this.addSql('create table `invite` (`id` integer not null primary key autoincrement, `accepted` integer not null default false, `invitersId` integer not null, `inviteesId` integer not null, `hubId` integer not null, constraint `invite_invitersId_foreign` foreign key(`invitersId`) references `user`(`id`) on delete cascade on update cascade, constraint `invite_inviteesId_foreign` foreign key(`inviteesId`) references `user`(`id`) on delete cascade on update cascade, constraint `invite_hubId_foreign` foreign key(`hubId`) references `hub`(`id`) on delete cascade on update cascade);');
    this.addSql('create index `invite_invitersId_index` on `invite` (`invitersId`);');
    this.addSql('create index `invite_inviteesId_index` on `invite` (`inviteesId`);');
    this.addSql('create index `invite_hubId_index` on `invite` (`hubId`);');
    this.addSql('create unique index `IDX_c8772f9bcb1e9f4faaa9c8873d` on `invite` (`invitersId`, `inviteesId`, `hubId`);');

    this.addSql('create table `join_user_hub` (`userId` integer not null, `hubId` integer not null, `isOwner` integer not null, `starred` integer not null default false, `isPresent` integer not null default false, `lastGeofenceEvent` text null, `lastUpdated` text null, constraint `join_user_hub_userId_foreign` foreign key(`userId`) references `user`(`id`) on delete cascade on update cascade, constraint `join_user_hub_hubId_foreign` foreign key(`hubId`) references `hub`(`id`) on delete cascade on update cascade, primary key (`userId`, `hubId`));');
    this.addSql('create index `join_user_hub_userId_index` on `join_user_hub` (`userId`);');
    this.addSql('create index `join_user_hub_hubId_index` on `join_user_hub` (`hubId`);');

    this.addSql('create table `micro_chat` (`id` integer not null primary key autoincrement, `hubId` integer not null, `text` text not null, constraint `micro_chat_hubId_foreign` foreign key(`hubId`) references `hub`(`id`) on delete cascade on update cascade);');
    this.addSql('create index `micro_chat_hubId_index` on `micro_chat` (`hubId`);');
  }

}
