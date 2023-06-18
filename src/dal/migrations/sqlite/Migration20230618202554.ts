import { Migration } from '@mikro-orm/migrations';

export class Migration20230618202554 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table `join_hub_file` (`fileId` integer not null, `hubId` integer not null, `userId` integer not null, constraint `join_hub_file_fileId_foreign` foreign key(`fileId`) references `file`(`id`) on delete cascade on update cascade, constraint `join_hub_file_hubId_foreign` foreign key(`hubId`) references `hub`(`id`) on delete cascade on update cascade, constraint `join_hub_file_userId_foreign` foreign key(`userId`) references `user`(`id`) on delete cascade on update cascade, primary key (`fileId`, `hubId`));');
    this.addSql('create index `join_hub_file_fileId_index` on `join_hub_file` (`fileId`);');
    this.addSql('create index `join_hub_file_hubId_index` on `join_hub_file` (`hubId`);');
    this.addSql('create index `join_hub_file_userId_index` on `join_hub_file` (`userId`);');

    this.addSql('create table `join_event_file` (`fileId` integer not null, `eventId` integer not null, `userId` integer not null, constraint `join_event_file_fileId_foreign` foreign key(`fileId`) references `file`(`id`) on delete cascade on update cascade, constraint `join_event_file_eventId_foreign` foreign key(`eventId`) references `event`(`id`) on delete cascade on update cascade, constraint `join_event_file_userId_foreign` foreign key(`userId`) references `user`(`id`) on delete cascade on update cascade, primary key (`fileId`, `eventId`));');
    this.addSql('create index `join_event_file_fileId_index` on `join_event_file` (`fileId`);');
    this.addSql('create index `join_event_file_eventId_index` on `join_event_file` (`eventId`);');
    this.addSql('create index `join_event_file_userId_index` on `join_event_file` (`userId`);');
  }

}
