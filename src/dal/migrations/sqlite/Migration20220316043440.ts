import { Migration } from '@mikro-orm/migrations';

export class Migration20220316043440 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table `block` (`from_id` integer not null, `to_id` integer not null, constraint `block_from_id_foreign` foreign key(`from_id`) references `user`(`id`) on delete cascade on update cascade, constraint `block_to_id_foreign` foreign key(`to_id`) references `user`(`id`) on delete cascade on update cascade, primary key (`from_id`, `to_id`));');
    this.addSql('create index `block_from_id_index` on `block` (`from_id`);');
    this.addSql('create index `block_to_id_index` on `block` (`to_id`);');
  }

}
