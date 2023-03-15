import { Migration } from '@mikro-orm/migrations';

export class Migration20230315053009 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "user" add column "profile_image_id" int null;');
    this.addSql('alter table "user" add constraint "user_profile_image_id_foreign" foreign key ("profile_image_id") references "file_upload" ("id") on update cascade on delete set null;');

    this.addSql('alter table "hub" add column "cover_image_id" int null;');
    this.addSql('alter table "hub" add constraint "hub_cover_image_id_foreign" foreign key ("cover_image_id") references "file_upload" ("id") on update cascade on delete set null;');

    this.addSql('alter table "event" add column "cover_image_id" int null;');
    this.addSql('alter table "event" add constraint "event_cover_image_id_foreign" foreign key ("cover_image_id") references "file_upload" ("id") on update cascade on delete set null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "hub" drop constraint "hub_cover_image_id_foreign";');

    this.addSql('alter table "user" drop constraint "user_profile_image_id_foreign";');

    this.addSql('alter table "event" drop constraint "event_cover_image_id_foreign";');

    this.addSql('alter table "hub" drop column "cover_image_id";');

    this.addSql('alter table "user" drop column "profile_image_id";');

    this.addSql('alter table "event" drop column "cover_image_id";');
  }

}
