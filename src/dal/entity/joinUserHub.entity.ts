import { Entity, Ref, ManyToOne, Property } from '@mikro-orm/core';
import { Field, ObjectType } from '@nestjs/graphql';
import { Hub } from './hub.entity';
import { User } from './user.entity';

export enum GeofenceEvent {
  ENTERED = "entered",
  DWELL = "dwell",
  EXITED = "exited"
}

 /* eslint-disable */ // needed for mikroorm default value & type which conflicts with typescript-eslint/no-unused-vars
@ObjectType()
@Entity()
export class JoinUserHub {

  /**
   * Exposed as a field resolver
   */
  @ManyToOne({
    entity: () => User,
    fieldName: 'userId',
    deleteRule: 'cascade', 
    primary: true,
    ref: true
  })
  public user!: Ref<User>;

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

  @Field()
  @Property({ fieldName: 'isOwner' })
  public isOwner!: boolean;

  @Field(() => Boolean)
  @Property({ default: false })
  public starred: boolean = false;

  @Field(() => Boolean)
  @Property({ default: false })
  public muted: boolean = false;

  /**
   * Exposed as a field resolver
   */
  @Property({ fieldName: 'isPresent', default: false })
  public isPresent: boolean = false;

  @Field({ nullable: true, description: 'last update event for presence' })
  @Property({ fieldName: 'lastGeofenceEvent', nullable: true })
  public lastGeofenceEvent?: string;
  
  @Field({ nullable: true, description: 'unix timestamp for the last time the presence state was updated' })
  @Property({ fieldName: 'lastUpdated', nullable: true })
  public lastUpdated?: string;
}
