import { Entity, Ref, ManyToOne } from '@mikro-orm/core';
import { ObjectType } from '@nestjs/graphql';
import { Event } from './event.entity';
import { File } from './file.entity';
import { User } from './user.entity';

 /* eslint-disable */ // needed for mikroorm default value & type which conflicts with typescript-eslint/no-unused-vars
@ObjectType()
@Entity()
export class JoinEventFile {

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
    entity: () => Event,
    fieldName: 'eventId',
    deleteRule: 'cascade',
    primary: true,
    ref: true
  })
  public event!: Ref<Event>;

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
