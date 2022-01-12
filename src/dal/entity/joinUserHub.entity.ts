import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
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
  @PrimaryKey()
  public userId: number;

  @Field(() => ID)
  @PrimaryKey()
  public hubId: number;

  @Field(() => User)
  @ManyToOne({
    entity: () => User,
    onDelete: 'CASCADE'
  })
  public user: User;

  @Field(() => Hub)
  @ManyToOne({ 
    entity: () => Hub,
    onDelete: 'CASCADE',
  })
  public hub: Hub;

  @Field()
  @Property({ fieldName: 'isOwner' })
  public isOwner: boolean;

  @Field()
  @Property({ default: false })
  public starred: boolean;

  /**
   * Exposed as a field resolver
   */
  @Property({ fieldName: 'isPresent' })
  public isPresent: boolean;

  @Field({ nullable: true, description: 'last update event for presence' })
  @Property({ fieldName: 'lastGeofenceEvent', nullable: true })
  public lastGeofenceEvent: string;
  
  @Field({ nullable: true, description: 'unix timestamp for the last time the presence state was updated' })
  @Property({ fieldName: 'lastUpdated', nullable: true })
  public lastUpdated: string;
}
