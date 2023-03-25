import { Migration } from '@mikro-orm/migrations';

export class Migration20230325183306 extends Migration {

  async up(): Promise<void> {
    this.addSql('PRAGMA foreign_keys = OFF;');
    this.addSql('CREATE TABLE `_knex_temp_alter718` (`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL, `shareableId` text NOT NULL, `firstName` text, `lastName` text, `birthdate` text NULL, `description` text NULL, `image` text NULL, `email` text, `password` text NOT NULL, `passwordResetId` integer NULL, `last_online` text NULL, `flagged` integer NULL, `banned` integer NULL, `phone_number` text NULL, `username` text NULL, `profile_image_id` integer NULL CONSTRAINT `user_profile_image_id_foreign` REFERENCES `file` (`id`) ON DELETE SET NULL ON UPDATE CASCADE, CONSTRAINT `user_passwordResetId_foreign` FOREIGN KEY (`passwordResetId`) REFERENCES `password_reset` (`id`) ON DELETE CASCADE ON UPDATE CASCADE);');
    this.addSql('INSERT INTO "_knex_temp_alter718" SELECT * FROM "user";;');
    this.addSql('DROP TABLE "user";');
    this.addSql('ALTER TABLE "_knex_temp_alter718" RENAME TO "user";');
    this.addSql('CREATE UNIQUE INDEX `user_passwordResetId_unique` on `user` (`passwordResetId`);');
    this.addSql('CREATE UNIQUE INDEX `user_email_unique` on `user` (`email`);');
    this.addSql('CREATE UNIQUE INDEX `user_username_unique` on `user` (`username`);');
    this.addSql('CREATE INDEX `user_profile_image_id_index` on `user` (`profile_image_id`);');
    this.addSql('PRAGMA foreign_keys = ON;');

    this.addSql('alter table `event` add column `minimum_capacity` real null;');
    this.addSql('alter table `event` add column `maximum_capacity` real null;');
  }

}
