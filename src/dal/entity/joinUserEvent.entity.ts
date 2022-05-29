import { Entity, IdentifiedReference, ManyToOne, Property } from '@mikro-orm/core';
import { Field, ObjectType } from '@nestjs/graphql';
import { Event } from './event.entity';
import { User } from './user.entity';

export enum GeofenceEvent {
  ENTERED = "entered",
  DWELL = "dwell",
  EXITED = "exited"
}

export enum RSVP {
    GOING = "going",
    MAYBE = "maybe",
    CANTGO = "cantgo"
}

 /* eslint-disable */ // needed for mikroorm default value & type which conflicts with typescript-eslint/no-unused-vars
@ObjectType()
@Entity()
export class JoinUserEvent {

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
  public user!: IdentifiedReference<User>;

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
  @Property({ fieldName: 'isPresent', default: false })
  public isPresent: boolean = false;

  @Field({ nullable: true, description: 'going or maybe or cantgo' })
  @Property({ fieldName: 'rsvp', nullable: true })
  public rsvp?: string;

  @Field({ nullable: true, description: 'last update event for presence' })
  @Property({ fieldName: 'lastGeofenceEvent', nullable: true })
  public lastGeofenceEvent?: string;
  
  @Field({ nullable: true, description: 'unix timestamp for the last time the presence state was updated' })
  @Property({ fieldName: 'lastUpdated', nullable: true })
  public lastUpdated?: string;
}
