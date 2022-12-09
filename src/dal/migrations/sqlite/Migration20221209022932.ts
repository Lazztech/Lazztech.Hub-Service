import { Migration } from '@mikro-orm/migrations';

export class Migration20221209022932 extends Migration {

  async up(): Promise<void> {
    this.addSql('create unique index `user_username_unique` on `user` (`username`);');
  }

}
