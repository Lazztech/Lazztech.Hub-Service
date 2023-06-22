import { Migration } from '@mikro-orm/migrations';

export class Migration20230622054623 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "join_hub_file" alter column "userId" type int using ("userId"::int);');
    this.addSql('alter table "join_hub_file" alter column "userId" drop not null;');

    this.addSql('alter table "join_event_file" alter column "userId" type int using ("userId"::int);');
    this.addSql('alter table "join_event_file" alter column "userId" drop not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "join_hub_file" alter column "userId" type int using ("userId"::int);');
    this.addSql('alter table "join_hub_file" alter column "userId" set not null;');

    this.addSql('alter table "join_event_file" alter column "userId" type int using ("userId"::int);');
    this.addSql('alter table "join_event_file" alter column "userId" set not null;');
  }

}
