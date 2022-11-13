import { Migration } from '@mikro-orm/migrations';

export class Migration20221113021754 extends Migration {

  async up(): Promise<void> {
    this.addSql('create unique index `user_email_unique` on `user` (`email`);');
  }

}
