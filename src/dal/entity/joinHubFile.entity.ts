import { Entity, Ref, ManyToOne } from '@mikro-orm/core';
import { ObjectType } from '@nestjs/graphql';
import { File } from './file.entity';
import { Hub } from './hub.entity';
import { User } from './user.entity';

 /* eslint-disable */ // needed for mikroorm default value & type which conflicts with typescript-eslint/no-unused-vars
@ObjectType()
@Entity()
export class JoinHubFile {

  /**
   * Exposed as a field resolver
   */
  @ManyToOne({
    entity: () => File,
    fieldName: 'fileId',
    deleteRule: 'cascade', 
    primary: true,
    ref: true
  })
  public file!: Ref<File>;

  /**
   * Exposed as a field resolver
   */
  @ManyToOne({ 
    entity: () => Hub,
    fieldName: 'hubId',
    deleteRule: 'cascade',
    primary: true,
    ref: true
  })
  public hub!: Ref<Hub>;

  /**
   * Exposed as a field resolver
   */
  @ManyToOne({
    entity: () => User,
    fieldName: 'userId',
    deleteRule: 'cascade', 
    ref: true,
    nullable: true,
  })
  public approvedBy?: Ref<User>;

}
