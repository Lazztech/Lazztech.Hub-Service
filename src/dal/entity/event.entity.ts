import { Collection, Entity, IdentifiedReference, ManyToOne, OneToMany, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ID, ObjectType } from "@nestjs/graphql";
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
  @Property({ nullable: true })
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

  @Property({ nullable: true })
  public allDay?: boolean;

  @Field({
    nullable: true,
    description: 'string representation of unix timestamp',
  })
  @Property({ nullable: true })
  public startDateTime?: string;

  @Field({
    nullable: true,
    description: 'string representation of unix timestamp',
  })
  @Property({ nullable: true })
  public endDateTime?: string;

  /**
   * Handled with a field resolver
   */
  @Property({ nullable: true })
  public image?: string;

  @Field({ nullable: true })
  @Property({ type: 'float', nullable: true })
  public latitude?: number;

  @Field({ nullable: true })
  @Property({ type: 'float', nullable: true })
  public longitude?: number;

  /**
   * Handled with a field resolver
   */
  @OneToMany(() => JoinUserEvent, (joinUserEvent) => joinUserEvent.event)
  public usersConnection = new Collection<JoinUserEvent>(this);

  @Property({ nullable: true })
  public flagged?: boolean;

  @Property({ nullable: true })
  public banned?: boolean;
}