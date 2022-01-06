import { Field, ID, ObjectType } from '@nestjs/graphql';
import { User } from './user.entity';
import { Hub } from './hub.entity';
import { Entity, Index, ManyToOne, PrimaryKey, Property, Unique } from '@mikro-orm/core';

@ObjectType()
@Entity()
@Index({ properties: ['invitersId', 'inviteesId', 'hubId'] })
@Unique({ properties: ['invitersId', 'inviteesId', 'hubId'] })
export class Invite {
  @Field(() => ID)
  @PrimaryKey()
  public id: number;

  @Field(() => ID)
  @Property()
  public invitersId: number;

  @Field(() => ID)
  @Property()
  public inviteesId: number;

  @Field(() => ID)
  @Property()
  public hubId: number;

  @Field(() => Boolean)
  @Property({ default: false })
  public accepted: boolean;

  @Field(() => User)
  @ManyToOne({ onDelete: 'CASCADE', joinColumn: 'invitersId' })
  public inviter: Promise<User>;

  @Field(() => User)
  @ManyToOne({
    onDelete: 'CASCADE',
    joinColumn: 'inviteesId'
  })
  public invitee: Promise<User>;

  @Field(() => Hub)
  @ManyToOne({ onDelete: 'CASCADE' })
  public hub: Promise<Hub>;
}
