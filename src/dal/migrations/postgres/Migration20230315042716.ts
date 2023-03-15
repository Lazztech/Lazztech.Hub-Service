import { Migration } from '@mikro-orm/migrations';

export class Migration20230315042716 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "file_upload" ("id" serial primary key, "shareableId" varchar(255) not null, "flagged" boolean null, "file_name" varchar(255) not null, "created_on" varchar(255) null, "createdByUserId" int null);');
    this.addSql('alter table "file_upload" add constraint "file_upload_file_name_unique" unique ("file_name");');

    this.addSql('alter table "file_upload" add constraint "file_upload_createdByUserId_foreign" foreign key ("createdByUserId") references "user" ("id") on update cascade on delete set null;');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "file_upload" cascade;');
  }

}
