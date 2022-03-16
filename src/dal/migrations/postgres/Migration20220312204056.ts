import { Migration } from '@mikro-orm/migrations';

export class Migration20220312204056 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "block" drop constraint "block_from_id_foreign";');
    this.addSql('alter table "block" drop constraint "block_to_id_foreign";');

    this.addSql('alter table "block" drop constraint "block_pkey";');
    this.addSql('alter table "block" drop column "id";');
    this.addSql('alter table "block" add constraint "block_from_id_foreign" foreign key ("from_id") references "user" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "block" add constraint "block_to_id_foreign" foreign key ("to_id") references "user" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "block" add constraint "block_pkey" primary key ("from_id", "to_id");');
  }

  async down(): Promise<void> {
    this.addSql('alter table "block" drop constraint "block_from_id_foreign";');
    this.addSql('alter table "block" drop constraint "block_to_id_foreign";');

    this.addSql('alter table "block" add column "id" serial not null;');
    this.addSql('alter table "block" drop constraint "block_pkey";');
    this.addSql('alter table "block" add constraint "block_from_id_foreign" foreign key ("from_id") references "user" ("id") on update cascade;');
    this.addSql('alter table "block" add constraint "block_to_id_foreign" foreign key ("to_id") references "user" ("id") on update cascade;');
    this.addSql('alter table "block" add constraint "block_pkey" primary key ("id");');
  }

}
