import { Entity, IdentifiedReference, ManyToOne } from '@mikro-orm/core';
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
    onDelete: 'cascade', 
    primary: true,
    wrappedReference: true
  })
  public file!: IdentifiedReference<File>;

  /**
   * Exposed as a field resolver
   */
  @ManyToOne({ 
    entity: () => Event,
    fieldName: 'eventId',
    onDelete: 'cascade',
    primary: true,
    wrappedReference: true
  })
  public event!: IdentifiedReference<Event>;

  /**
   * Exposed as a field resolver
   */
  @ManyToOne({
    entity: () => User,
    fieldName: 'userId',
    onDelete: 'cascade', 
    wrappedReference: true
  })
  public approvedBy?: IdentifiedReference<User>;

}
