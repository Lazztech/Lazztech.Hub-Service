import { Migration } from '@mikro-orm/migrations';

export class Migration20240602032850 extends Migration {

  async up(): Promise<void> {
    this.addSql('PRAGMA foreign_keys = OFF;');
    this.addSql('CREATE TABLE `_knex_temp_alter323` (`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL, `fcmPushUserToken` text, `userId` integer NOT NULL, `web_push_subscription` json NULL, CONSTRAINT `user_device_userId_foreign` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE);');
    this.addSql('INSERT INTO "_knex_temp_alter323" SELECT * FROM "user_device";;');
    this.addSql('DROP TABLE "user_device";');
    this.addSql('ALTER TABLE "_knex_temp_alter323" RENAME TO "user_device";');
    this.addSql('CREATE UNIQUE INDEX `user_device_fcmPushUserToken_unique` on `user_device` (`fcmPushUserToken`);');
    this.addSql('CREATE INDEX `user_device_userId_index` on `user_device` (`userId`);');
    this.addSql('PRAGMA foreign_keys = ON;');
  }

}
