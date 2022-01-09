import { EntityRepository, IDatabaseDriver } from '@mikro-orm/core';
import { Migration } from '@mikro-orm/migrations';
import { InjectRepository } from '@mikro-orm/nestjs';
import { AbstractSqlConnection, AbstractSqlDriver } from '@mikro-orm/postgresql';
import { v4 as uuid } from 'uuid';
import { Hub } from "../../entity/hub.entity";
import { User } from "../../entity/user.entity";

export class InsertShareableIds1639774353045 extends Migration {

  constructor(
    driver: AbstractSqlDriver<AbstractSqlConnection>, 
    config: any,
    @InjectRepository(Hub)
    private hubRepo: EntityRepository<Hub>,
    @InjectRepository(User)
    private userRepo: EntityRepository<User>,
    ) {
    super(driver, config);
  }


  public async up(): Promise<void> {
    const hubs = await this.hubRepo.find({shareableId: null});
    for (const hub of hubs) {
      hub.shareableId = uuid();
      await this.hubRepo.persistAndFlush(hub);
    }

    const users = await this.userRepo.find({shareableId: null});
    for (const user of users) {
      user.shareableId = uuid();
      await this.hubRepo.persistAndFlush(user);
    }
  }

  public async down(): Promise<void> {
    const hubs = await this.hubRepo.find({shareableId: { $ne: null } });
    for (const hub of hubs) {
      hub.shareableId = null;
      await this.userRepo.persistAndFlush(hubs);
    }

    const users = await this.userRepo.find({shareableId: { $ne: null }});
    for (const user of users) {
      user.shareableId = null;
      await this.userRepo.persistAndFlush(user);
    }
  }
}
