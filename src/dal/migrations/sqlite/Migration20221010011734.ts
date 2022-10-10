import { Migration } from '@mikro-orm/migrations';

export class Migration20221010011734 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table `event` (`id` integer not null primary key autoincrement, `shareableId` text not null, `name` text not null, `description` text null, `createdByUserId` integer not null, `start_date_time` text null, `end_date_time` text null, `image` text null, `latitude` real null, `longitude` real null, `location_label` text null, `flagged` integer null, `banned` integer null, constraint `event_createdByUserId_foreign` foreign key(`createdByUserId`) references `user`(`id`) on update cascade);');
    this.addSql('create index `event_createdByUserId_index` on `event` (`createdByUserId`);');

    this.addSql('create table `join_user_event` (`userId` integer not null, `eventId` integer not null, `isPresent` integer not null default false, `rsvp` text null, `lastGeofenceEvent` text null, `lastUpdated` text null, constraint `join_user_event_userId_foreign` foreign key(`userId`) references `user`(`id`) on delete cascade on update cascade, constraint `join_user_event_eventId_foreign` foreign key(`eventId`) references `event`(`id`) on delete cascade on update cascade, primary key (`userId`, `eventId`));');
    this.addSql('create index `join_user_event_userId_index` on `join_user_event` (`userId`);');
    this.addSql('create index `join_user_event_eventId_index` on `join_user_event` (`eventId`);');

    this.addSql('alter table `hub` add column `location_label` text null;');

    this.addSql('alter table `user` add column `phone_number` text null;');
    this.addSql('drop index `user_passwordResetId_index`;');
  }

}
