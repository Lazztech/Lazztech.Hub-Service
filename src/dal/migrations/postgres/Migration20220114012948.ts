import { Migration } from '@mikro-orm/migrations';

export class Migration20220114012948 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "user" drop constraint "REL_5d250ff0a3f3eba15ff2db819d";');

    this.addSql('alter table "user_device" drop constraint "UQ_9fa10355d40f3311b221b15c04c";');

    this.addSql('alter table "user_device" add constraint "user_device_fcmPushUserToken_unique" unique ("fcmPushUserToken");');

    this.addSql('DROP INDEX "IDX_c8772f9bcb1e9f4faaa9c8873d"')

    this.addSql('alter table "invite" add constraint "invite_invitersId_inviteesId_hubId_unique" unique ("invitersId", "inviteesId", "hubId");');

    this.addSql('drop table if exists "migrations" cascade;');
  }

}
