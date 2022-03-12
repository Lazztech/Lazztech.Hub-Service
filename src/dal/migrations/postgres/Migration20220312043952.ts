import { Migration } from '@mikro-orm/migrations';

export class Migration20220312045321 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "block" ("id" serial primary key, "from_id" int not null, "to_id" int not null);');

    this.addSql('alter table "block" add constraint "block_from_id_foreign" foreign key ("from_id") references "user" ("id") on update cascade;');
    this.addSql('alter table "block" add constraint "block_to_id_foreign" foreign key ("to_id") references "user" ("id") on update cascade;');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "block" cascade;');
  }

}
