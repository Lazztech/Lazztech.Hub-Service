import { Collection, Entity, IdentifiedReference, ManyToOne, OneToMany, PrimaryKey, Property, types } from "@mikro-orm/core";
import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Hub } from "./hub.entity";
import { JoinUserEvent } from "./joinUserEvent.entity";
import { ShareableId } from "./shareableId.entity";
import { User } from "./user.entity";

/* eslint-disable */ // needed for mikroorm default value & type which conflicts with typescript-eslint/no-unused-vars
@ObjectType()
@Entity()
export class Event extends ShareableId {
  @Field(() => ID)
  @PrimaryKey()
  public id!: number;

  @Field()
  @Property()
  public name!: string;

  @Field({ nullable: true })
  @Property({ nullable: true, type: types.text })
  public description?: string;

  /**
   * Exposed as a field resolver
   */
  @ManyToOne({
    entity: () => User,
    fieldName: 'createdByUserId',
    wrappedReference: true
  })
  public createdBy!: IdentifiedReference<User>;

  @Field({
    nullable: true,
    description: 'ISO 8601 Date Time',
  })
  @Property({ nullable: true })
  public startDateTime?: string;

  @Field({
    nullable: true,
    description: 'ISO 8601 Date Time',
  })
  @Property({ nullable: true })
  public endDateTime?: string;

  /**
   * Handled with a field resolver
   */
  @Property({ nullable: true })
  public image?: string;

  /**
   * Exposed as a field resolver
   */
  @ManyToOne({ 
    entity: () => Hub,
    wrappedReference: true,
    nullable: true,
  })
  public hub?: IdentifiedReference<Hub>;

  /**
   * Handled with a field resolver
   */
  @Property({ type: 'float', nullable: true })
  public latitude?: number;

  /**
   * Handled with a field resolver
   */
  @Property({ type: 'float', nullable: true })
  public longitude?: number;

  /**
   * Handled with a field resolver
   */
  @Property({ nullable: true })
  public locationLabel?: string;

  /**
   * Handled with a field resolver
   */
  @OneToMany(() => JoinUserEvent, (joinUserEvent) => joinUserEvent.event)
  public usersConnection = new Collection<JoinUserEvent>(this);

  @Property({ nullable: true })
  public banned?: boolean;
}