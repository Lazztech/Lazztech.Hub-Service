import { Migration } from '@mikro-orm/migrations';

export class Migration20240601225226 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `user_device` add column `web_push_subscription` json null;');
  }

}
