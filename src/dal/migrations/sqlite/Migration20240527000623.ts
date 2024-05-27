import { Migration } from '@mikro-orm/migrations';

export class Migration20240527000623 extends Migration {

  async up(): Promise<void> {
    this.addSql('PRAGMA foreign_keys = OFF;');
    this.addSql('CREATE TABLE `_knex_temp_alter256` (`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL, `shareableId` text NOT NULL, `name` text NOT NULL, `description` text NULL, `createdByUserId` integer NOT NULL, `start_date_time` text NULL, `end_date_time` text NULL, `image` text NULL, `latitude` real NULL, `longitude` real NULL, `location_label` text NULL, `flagged` integer NULL, `banned` integer NULL, `hub_id` integer NULL CONSTRAINT `event_hub_id_foreign` REFERENCES `hub` (`id`) ON DELETE SET NULL ON UPDATE CASCADE, `cover_image_id` integer NULL CONSTRAINT `event_cover_image_id_foreign` REFERENCES `file` (`id`) ON DELETE SET NULL ON UPDATE CASCADE, `minimum_capacity` real NULL, `maximum_capacity` real NULL, CONSTRAINT `event_createdByUserId_foreign` FOREIGN KEY (`createdByUserId`) REFERENCES `user` (`id`) ON UPDATE CASCADE, CONSTRAINT `event_createdByUserId_foreign` FOREIGN KEY (`createdByUserId`) REFERENCES `user` (`id`) ON DELETE cascade ON UPDATE cascade);');
    this.addSql('INSERT INTO "_knex_temp_alter256" SELECT * FROM "event";;');
    this.addSql('DROP TABLE "event";');
    this.addSql('ALTER TABLE "_knex_temp_alter256" RENAME TO "event";');
    this.addSql('CREATE INDEX `event_createdByUserId_index` on `event` (`createdByUserId`);');
    this.addSql('CREATE INDEX `event_hub_id_index` on `event` (`hub_id`);');
    this.addSql('CREATE INDEX `event_cover_image_id_index` on `event` (`cover_image_id`);');
    this.addSql('PRAGMA foreign_keys = ON;');
  }

}
