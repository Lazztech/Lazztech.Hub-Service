import { Migration } from '@mikro-orm/migrations';

export class Migration20250924211110 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table `password_reset` (`id` integer not null primary key autoincrement, `pin` text not null);');

    this.addSql('create table `user` (`id` integer not null primary key autoincrement, `shareableId` text not null, `flagged` integer null, `banned` integer null, `username` text null, `firstName` text null, `lastName` text null, `birthdate` text null, `description` text null, `profile_image_id` integer null, `image` text null, `email` text null, `phone_number` text null, `password` text not null, `last_online` text null, `passwordResetId` integer null, constraint `user_profile_image_id_foreign` foreign key(`profile_image_id`) references `file`(`id`) on delete set null on update cascade, constraint `user_passwordResetId_foreign` foreign key(`passwordResetId`) references `password_reset`(`id`) on delete cascade on update cascade);');
    this.addSql('create unique index `user_username_unique` on `user` (`username`);');
    this.addSql('create index `user_profile_image_id_index` on `user` (`profile_image_id`);');
    this.addSql('create unique index `user_email_unique` on `user` (`email`);');
    this.addSql('create unique index `user_passwordResetId_unique` on `user` (`passwordResetId`);');

    this.addSql('create table `in_app_notification` (`id` integer not null primary key autoincrement, `header` text null, `text` text not null, `date` text not null, `thumbnail` text null, `actionLink` text null, `userId` integer not null, constraint `in_app_notification_userId_foreign` foreign key(`userId`) references `user`(`id`) on delete CASCADE on update cascade);');
    this.addSql('create index `in_app_notification_userId_index` on `in_app_notification` (`userId`);');

    this.addSql('create table `file` (`id` integer not null primary key autoincrement, `shareableId` text not null, `flagged` integer null, `banned` integer null, `file_name` text not null, `mimetype` text null, `created_on` text not null, `createdByUserId` integer not null, constraint `file_createdByUserId_foreign` foreign key(`createdByUserId`) references `user`(`id`) on update cascade);');
    this.addSql('create unique index `file_file_name_unique` on `file` (`file_name`);');
    this.addSql('create index `file_createdByUserId_index` on `file` (`createdByUserId`);');

    this.addSql('create table `hub` (`id` integer not null primary key autoincrement, `shareableId` text not null, `flagged` integer null, `banned` integer null, `name` text not null, `description` text null, `active` integer not null default true, `cover_image_id` integer null, `image` text null, `latitude` real null, `longitude` real null, `location_label` text null, constraint `hub_cover_image_id_foreign` foreign key(`cover_image_id`) references `file`(`id`) on delete set null on update cascade);');
    this.addSql('create index `hub_cover_image_id_index` on `hub` (`cover_image_id`);');

    this.addSql('create table `join_user_hub` (`userId` integer not null, `hubId` integer not null, `isOwner` integer not null, `starred` integer not null default false, `muted` integer not null default false, `isPresent` integer not null default false, `lastGeofenceEvent` text null, `lastUpdated` text null, constraint `join_user_hub_userId_foreign` foreign key(`userId`) references `user`(`id`) on delete cascade on update cascade, constraint `join_user_hub_hubId_foreign` foreign key(`hubId`) references `hub`(`id`) on delete cascade on update cascade, primary key (`userId`, `hubId`));');
    this.addSql('create index `join_user_hub_userId_index` on `join_user_hub` (`userId`);');
    this.addSql('create index `join_user_hub_hubId_index` on `join_user_hub` (`hubId`);');

    this.addSql('create table `join_hub_file` (`fileId` integer not null, `hubId` integer not null, `userId` integer null, constraint `join_hub_file_fileId_foreign` foreign key(`fileId`) references `file`(`id`) on delete cascade on update cascade, constraint `join_hub_file_hubId_foreign` foreign key(`hubId`) references `hub`(`id`) on delete cascade on update cascade, constraint `join_hub_file_userId_foreign` foreign key(`userId`) references `user`(`id`) on delete cascade on update cascade, primary key (`fileId`, `hubId`));');
    this.addSql('create index `join_hub_file_fileId_index` on `join_hub_file` (`fileId`);');
    this.addSql('create index `join_hub_file_hubId_index` on `join_hub_file` (`hubId`);');
    this.addSql('create index `join_hub_file_userId_index` on `join_hub_file` (`userId`);');

    this.addSql('create table `invite` (`id` integer not null primary key autoincrement, `accepted` integer not null default false, `invitersId` integer not null, `inviteesId` integer not null, `hubId` integer not null, constraint `invite_invitersId_foreign` foreign key(`invitersId`) references `user`(`id`) on delete cascade on update cascade, constraint `invite_inviteesId_foreign` foreign key(`inviteesId`) references `user`(`id`) on delete cascade on update cascade, constraint `invite_hubId_foreign` foreign key(`hubId`) references `hub`(`id`) on delete cascade on update cascade);');
    this.addSql('create index `invite_invitersId_index` on `invite` (`invitersId`);');
    this.addSql('create index `invite_inviteesId_index` on `invite` (`inviteesId`);');
    this.addSql('create index `invite_hubId_index` on `invite` (`hubId`);');
    this.addSql('create unique index `invite_invitersId_inviteesId_hubId_unique` on `invite` (`invitersId`, `inviteesId`, `hubId`);');

    this.addSql('create table `event` (`id` integer not null primary key autoincrement, `shareableId` text not null, `flagged` integer null, `banned` integer null, `name` text not null, `description` text null, `createdByUserId` integer not null, `start_date_time` text null, `end_date_time` text null, `minimum_capacity` real null, `maximum_capacity` real null, `cover_image_id` integer null, `image` text null, `hub_id` integer null, `latitude` real null, `longitude` real null, `location_label` text null, constraint `event_createdByUserId_foreign` foreign key(`createdByUserId`) references `user`(`id`) on delete cascade on update cascade, constraint `event_cover_image_id_foreign` foreign key(`cover_image_id`) references `file`(`id`) on delete set null on update cascade, constraint `event_hub_id_foreign` foreign key(`hub_id`) references `hub`(`id`) on delete set null on update cascade);');
    this.addSql('create index `event_createdByUserId_index` on `event` (`createdByUserId`);');
    this.addSql('create index `event_cover_image_id_index` on `event` (`cover_image_id`);');
    this.addSql('create index `event_hub_id_index` on `event` (`hub_id`);');

    this.addSql('create table `join_user_event` (`userId` integer not null, `eventId` integer not null, `isPresent` integer not null default false, `rsvp` text null, `lastGeofenceEvent` text null, `lastUpdated` text null, constraint `join_user_event_userId_foreign` foreign key(`userId`) references `user`(`id`) on delete cascade on update cascade, constraint `join_user_event_eventId_foreign` foreign key(`eventId`) references `event`(`id`) on delete cascade on update cascade, primary key (`userId`, `eventId`));');
    this.addSql('create index `join_user_event_userId_index` on `join_user_event` (`userId`);');
    this.addSql('create index `join_user_event_eventId_index` on `join_user_event` (`eventId`);');

    this.addSql('create table `join_event_file` (`fileId` integer not null, `eventId` integer not null, `userId` integer null, constraint `join_event_file_fileId_foreign` foreign key(`fileId`) references `file`(`id`) on delete cascade on update cascade, constraint `join_event_file_eventId_foreign` foreign key(`eventId`) references `event`(`id`) on delete cascade on update cascade, constraint `join_event_file_userId_foreign` foreign key(`userId`) references `user`(`id`) on delete cascade on update cascade, primary key (`fileId`, `eventId`));');
    this.addSql('create index `join_event_file_fileId_index` on `join_event_file` (`fileId`);');
    this.addSql('create index `join_event_file_eventId_index` on `join_event_file` (`eventId`);');
    this.addSql('create index `join_event_file_userId_index` on `join_event_file` (`userId`);');

    this.addSql('create table `block` (`from_id` integer not null, `to_id` integer not null, constraint `block_from_id_foreign` foreign key(`from_id`) references `user`(`id`) on delete cascade on update cascade, constraint `block_to_id_foreign` foreign key(`to_id`) references `user`(`id`) on delete cascade on update cascade, primary key (`from_id`, `to_id`));');
    this.addSql('create index `block_from_id_index` on `block` (`from_id`);');
    this.addSql('create index `block_to_id_index` on `block` (`to_id`);');

    this.addSql('create table `user_device` (`id` integer not null primary key autoincrement, `fcmPushUserToken` text null, `web_push_subscription` json null, `userId` integer not null, constraint `user_device_userId_foreign` foreign key(`userId`) references `user`(`id`) on delete cascade on update cascade);');
    this.addSql('create unique index `user_device_fcmPushUserToken_unique` on `user_device` (`fcmPushUserToken`);');
    this.addSql('create index `user_device_userId_index` on `user_device` (`userId`);');
  }

}
