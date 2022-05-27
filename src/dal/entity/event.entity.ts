import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ID, ObjectType } from "@nestjs/graphql";
import { ShareableId } from "./shareableId.entity";

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

  @Property({ nullable: true })
  public flagged?: boolean;

  @Property({ nullable: true })
  public banned?: boolean;
}