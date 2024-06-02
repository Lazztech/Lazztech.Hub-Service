import { Migration } from '@mikro-orm/migrations';

export class Migration20240602032851 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "user_device" alter column "fcmPushUserToken" type varchar(255) using ("fcmPushUserToken"::varchar(255));');
    this.addSql('alter table "user_device" alter column "fcmPushUserToken" drop not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "user_device" alter column "fcmPushUserToken" type varchar(255) using ("fcmPushUserToken"::varchar(255));');
    this.addSql('alter table "user_device" alter column "fcmPushUserToken" set not null;');
  }

}
