import { Migration } from '@mikro-orm/migrations';

export class Migration20220724014643 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "hub" drop constraint if exists "hub_active_check";');
    this.addSql('alter table "hub" alter column "active" type boolean using ("active"::boolean);');
    this.addSql('alter table "hub" alter column "active" set default true;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "hub" drop constraint if exists "hub_active_check";');
    this.addSql('alter table "hub" alter column "active" type boolean using ("active"::boolean);');
    this.addSql('alter table "hub" alter column "active" set default false;');
  }

}
