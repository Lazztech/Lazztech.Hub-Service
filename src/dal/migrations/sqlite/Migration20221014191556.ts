import { Migration } from '@mikro-orm/migrations';

export class Migration20221014191556 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `event` add column `hub_id` integer null constraint `event_hub_id_foreign` references `hub` (`id`) on update cascade on delete set null;');
    this.addSql('create index `event_hub_id_index` on `event` (`hub_id`);');
  }

}
