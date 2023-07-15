import { Migration } from '@mikro-orm/migrations';

export class Migration20230712055614 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `file` add column `banned` integer null;');
  }

}
