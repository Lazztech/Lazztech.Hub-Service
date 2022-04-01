import { Migration } from '@mikro-orm/migrations';

export class Migration20220401041319 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `user` add column `flagged` integer null;');
    this.addSql('alter table `user` add column `banned` integer null;');

    this.addSql('alter table `hub` add column `flagged` integer null;');
    this.addSql('alter table `hub` add column `banned` integer null;');
  }

}
