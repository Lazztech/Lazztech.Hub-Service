import { Migration } from '@mikro-orm/migrations';

export class Migration20230712055532 extends Migration {

  async up(): Promise<void> {
    this.addSql('PRAGMA foreign_keys = OFF;');
    this.addSql('CREATE TABLE `_knex_temp_alter795` (`fileId` integer NOT NULL, `hubId` integer NOT NULL, `userId` integer, CONSTRAINT `join_hub_file_fileId_foreign` FOREIGN KEY (`fileId`) REFERENCES `file` (`id`) ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT `join_hub_file_hubId_foreign` FOREIGN KEY (`hubId`) REFERENCES `hub` (`id`) ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT `join_hub_file_userId_foreign` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE, PRIMARY KEY (`fileId`, `hubId`));');
    this.addSql('INSERT INTO "_knex_temp_alter795" SELECT * FROM "join_hub_file";;');
    this.addSql('DROP TABLE "join_hub_file";');
    this.addSql('ALTER TABLE "_knex_temp_alter795" RENAME TO "join_hub_file";');
    this.addSql('CREATE INDEX `join_hub_file_fileId_index` on `join_hub_file` (`fileId`);');
    this.addSql('CREATE INDEX `join_hub_file_hubId_index` on `join_hub_file` (`hubId`);');
    this.addSql('CREATE INDEX `join_hub_file_userId_index` on `join_hub_file` (`userId`);');
    this.addSql('PRAGMA foreign_keys = ON;');

    this.addSql('PRAGMA foreign_keys = OFF;');
    this.addSql('CREATE TABLE `_knex_temp_alter883` (`fileId` integer NOT NULL, `eventId` integer NOT NULL, `userId` integer, CONSTRAINT `join_event_file_fileId_foreign` FOREIGN KEY (`fileId`) REFERENCES `file` (`id`) ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT `join_event_file_eventId_foreign` FOREIGN KEY (`eventId`) REFERENCES `event` (`id`) ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT `join_event_file_userId_foreign` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE, PRIMARY KEY (`fileId`, `eventId`));');
    this.addSql('INSERT INTO "_knex_temp_alter883" SELECT * FROM "join_event_file";;');
    this.addSql('DROP TABLE "join_event_file";');
    this.addSql('ALTER TABLE "_knex_temp_alter883" RENAME TO "join_event_file";');
    this.addSql('CREATE INDEX `join_event_file_fileId_index` on `join_event_file` (`fileId`);');
    this.addSql('CREATE INDEX `join_event_file_eventId_index` on `join_event_file` (`eventId`);');
    this.addSql('CREATE INDEX `join_event_file_userId_index` on `join_event_file` (`userId`);');
    this.addSql('PRAGMA foreign_keys = ON;');
  }

}
