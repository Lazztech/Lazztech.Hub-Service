import { Migration } from '@mikro-orm/migrations';

export class Migration20230319203118 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table `file` (`id` integer not null primary key autoincrement, `shareableId` text not null, `flagged` integer null, `file_name` text not null, `mimetype` text null, `created_on` text not null, `createdByUserId` integer not null, constraint `file_createdByUserId_foreign` foreign key(`createdByUserId`) references `user`(`id`) on update cascade);');
    this.addSql('create unique index `file_file_name_unique` on `file` (`file_name`);');
    this.addSql('create index `file_createdByUserId_index` on `file` (`createdByUserId`);');

    this.addSql('alter table `user` add column `profile_image_id` integer null constraint `user_profile_image_id_foreign` references `file` (`id`) on update cascade on delete set null;');
    this.addSql('create index `user_profile_image_id_index` on `user` (`profile_image_id`);');

    this.addSql('alter table `hub` add column `cover_image_id` integer null constraint `hub_cover_image_id_foreign` references `file` (`id`) on update cascade on delete set null;');
    this.addSql('create index `hub_cover_image_id_index` on `hub` (`cover_image_id`);');

    this.addSql('alter table `event` add column `cover_image_id` integer null constraint `event_cover_image_id_foreign` references `file` (`id`) on update cascade on delete set null;');
    this.addSql('create index `event_cover_image_id_index` on `event` (`cover_image_id`);');
  }

}
