import { Migration } from '@mikro-orm/migrations';

export class Migration20230904224807 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `hub` add column `url` text null;');

    this.addSql('alter table `event` add column `url` text null;');
  }

}
