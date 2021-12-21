import {IsNull, MigrationInterface, Not, QueryRunner} from "typeorm";
import { v4 as uuid } from 'uuid';
import { Hub } from "../../entity/hub.entity";
import { User } from "../../entity/user.entity";

export class InsertShareableIds1639774350366 implements MigrationInterface {


  public async up(queryRunner: QueryRunner): Promise<void> {
    const hubRepo = queryRunner.connection.getRepository(Hub)
    const userRepo = queryRunner.connection.getRepository(User)
    const hubs = await hubRepo.find({where:{shareableId: null}})
    for (let i = 0; i < hubs.length; i++) {
      await queryRunner.manager.createQueryBuilder().update('hub').set({shareableId: uuid()}).where({id: hubs[i].id}).execute()
    }
    const users = await userRepo.find({where:{shareableId: null}})
    for (let i = 0; i < users.length; i++) {
      await queryRunner.manager.createQueryBuilder().update('user').set({shareableId: uuid()}).where({id: users[i].id}).execute()
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const hubRepo = queryRunner.connection.getRepository(Hub)
    const hubs = await hubRepo.find({where:{shareableId: Not(IsNull()) }})
    for (let i = 0; i < hubs.length; i++) {
      await queryRunner.manager.createQueryBuilder().update('hub').set({shareableId: null}).where({id: hubs[i].id}).execute()
    }
    const userRepo = queryRunner.connection.getRepository(User)
    const users = await userRepo.find({where:{shareableId: Not(IsNull())}})
    for (let i = 0; i < users.length; i++) {
      await queryRunner.manager.createQueryBuilder().update('user').set({shareableId: null}).where({id: users[i].id}).execute()
    }
  }

}
