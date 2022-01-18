import { Entity, IdentifiedReference, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Hub } from './hub.entity';
import { User } from './user.entity';

export enum GeofenceEvent {
  ENTERED = "entered",
  DWELL = "dwell",
  EXITED = "exited"
}

@ObjectType()
@Entity()
export class JoinUserHub {
  @Field(() => ID)
  @PrimaryKey({ fieldName: 'userId'})
  public userId: number;

  @Field(() => ID)
  @PrimaryKey({ fieldName: 'hubId'})
  public hubId: number;

  /**
   * Exposed as a field resolver
   */
  @ManyToOne({
    entity: () => User,
    fieldName: 'userId',
    onDelete: 'cascade', 
    primary: true,
    wrappedReference: true
  })
  public user: IdentifiedReference<User>;

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
  public hub: IdentifiedReference<Hub>;

  @Field()
  @Property({ fieldName: 'isOwner' })
  public isOwner: boolean;

  @Field()
  @Property({ default: false })
  public starred: boolean;

  /**
   * Exposed as a field resolver
   */
  @Property({ fieldName: 'isPresent', default: false })
  public isPresent: boolean;

  @Field({ nullable: true, description: 'last update event for presence' })
  @Property({ fieldName: 'lastGeofenceEvent', nullable: true })
  public lastGeofenceEvent: string;
  
  @Field({ nullable: true, description: 'unix timestamp for the last time the presence state was updated' })
  @Property({ fieldName: 'lastUpdated', nullable: true })
  public lastUpdated: string;
}
