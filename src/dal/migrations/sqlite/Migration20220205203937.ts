import { Migration } from '@mikro-orm/migrations';

export class Migration20220205203937 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `user` add column `last_online` text null;');
  }

}
