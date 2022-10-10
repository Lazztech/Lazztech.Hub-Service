import { Migration } from '@mikro-orm/migrations';

export class Migration20221010030108 extends Migration {

  async up(): Promise<void> {
    this.addSql('PRAGMA foreign_keys = OFF;');
    this.addSql('CREATE TABLE `_knex_temp_alter907` (`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL, `shareableId` text NOT NULL, `name` text NOT NULL, `description` text NULL, `active` integer NOT NULL DEFAULT true, `image` text NULL, `latitude` real NULL, `longitude` real NULL, `flagged` integer NULL, `banned` integer NULL, `location_label` text NULL);');
    this.addSql('INSERT INTO "_knex_temp_alter907" SELECT * FROM "hub";;');
    this.addSql('DROP TABLE "hub";');
    this.addSql('ALTER TABLE "_knex_temp_alter907" RENAME TO "hub";');
    this.addSql('PRAGMA foreign_keys = ON;');

    this.addSql('alter table `join_user_hub` add column `muted` integer not null default false;');
  }

}
