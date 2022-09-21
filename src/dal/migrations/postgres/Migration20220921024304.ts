import { Migration } from '@mikro-orm/migrations';

export class Migration20220921024304 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "hub" alter column "description" type text using ("description"::text);');

    this.addSql('alter table "event" alter column "description" type text using ("description"::text);');
  }

  async down(): Promise<void> {
    this.addSql('alter table "hub" alter column "description" type varchar(255) using ("description"::varchar(255));');

    this.addSql('alter table "event" alter column "description" type varchar(255) using ("description"::varchar(255));');
  }

}
