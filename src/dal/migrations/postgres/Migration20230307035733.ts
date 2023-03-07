import { Migration } from '@mikro-orm/migrations';

export class Migration20230307035733 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "file_upload" ("id" int not null, "userId" int null, "file_name" varchar(255) not null, "type" varchar(255) not null, "uploaded_on" varchar(255) null, constraint "file_upload_pkey" primary key ("id", "userId"));');
    this.addSql('alter table "file_upload" add constraint "file_upload_file_name_unique" unique ("file_name");');

    this.addSql('alter table "file_upload" add constraint "file_upload_userId_foreign" foreign key ("userId") references "user" ("id") on update cascade on delete cascade;');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "file_upload" cascade;');
  }

}
