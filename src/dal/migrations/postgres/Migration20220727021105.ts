import { Migration } from '@mikro-orm/migrations';

export class Migration20220727021105 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "user" add column "phone_country_code" int null, add column "phone_area_code" int null, add column "phone_number" int null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "user" drop column "phone_country_code";');
    this.addSql('alter table "user" drop column "phone_area_code";');
    this.addSql('alter table "user" drop column "phone_number";');
  }

}
