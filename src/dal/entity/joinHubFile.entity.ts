import { Entity, IdentifiedReference, ManyToOne } from '@mikro-orm/core';
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
    onDelete: 'cascade', 
    primary: true,
    wrappedReference: true
  })
  public file!: IdentifiedReference<File>;

  /**
   * Exposed as a field resolver
   */
  @ManyToOne({ 
    entity: () => Hub,
    fieldName: 'hubId',
    onDelete: 'cascade',
    primary: true,
    wrappedReference: true
  })
  public hub!: IdentifiedReference<Hub>;

  /**
   * Exposed as a field resolver
   */
  @ManyToOne({
    entity: () => User,
    fieldName: 'userId',
    onDelete: 'cascade', 
    wrappedReference: true,
    nullable: true,
  })
  public approvedBy?: IdentifiedReference<User>;

}
