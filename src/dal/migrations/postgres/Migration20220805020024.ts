import { Migration } from '@mikro-orm/migrations';

export class Migration20220805020024 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "user" drop constraint if exists "user_phone_number_check";');
    this.addSql('alter table "user" alter column "phone_number" type varchar(255) using ("phone_number"::varchar(255));');
    this.addSql('alter table "user" drop column "phone_country_code";');
    this.addSql('alter table "user" drop column "phone_area_code";');
  }

  async down(): Promise<void> {
    this.addSql('alter table "user" add column "phone_country_code" int null, add column "phone_area_code" int null;');
    this.addSql('alter table "user" drop constraint if exists "user_phone_number_check";');
    this.addSql('alter table "user" alter column "phone_number" type int using ("phone_number"::int);');
  }

}
