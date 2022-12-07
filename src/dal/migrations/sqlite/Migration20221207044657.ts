import { Migration } from '@mikro-orm/migrations';

export class Migration20221207044657 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `user` add column `username` text null;');
  }

}
