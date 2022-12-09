import { Migration } from '@mikro-orm/migrations';

export class Migration20221207042722 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "user" add column "username" varchar(255) null;');
    this.addSql('alter table "user" alter column "firstName" type varchar(255) using ("firstName"::varchar(255));');
    this.addSql('alter table "user" alter column "firstName" drop not null;');
    this.addSql('alter table "user" alter column "lastName" type varchar(255) using ("lastName"::varchar(255));');
    this.addSql('alter table "user" alter column "lastName" drop not null;');
    this.addSql('alter table "user" alter column "email" type varchar(255) using ("email"::varchar(255));');
    this.addSql('alter table "user" alter column "email" drop not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "user" alter column "firstName" type varchar(255) using ("firstName"::varchar(255));');
    this.addSql('alter table "user" alter column "firstName" set not null;');
    this.addSql('alter table "user" alter column "lastName" type varchar(255) using ("lastName"::varchar(255));');
    this.addSql('alter table "user" alter column "lastName" set not null;');
    this.addSql('alter table "user" alter column "email" type varchar(255) using ("email"::varchar(255));');
    this.addSql('alter table "user" alter column "email" set not null;');
    this.addSql('alter table "user" drop column "username";');
  }

}
