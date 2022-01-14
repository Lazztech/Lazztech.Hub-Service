import { Field, ID, ObjectType } from '@nestjs/graphql';
import { User } from './user.entity';
import { Hub } from './hub.entity';
import { Entity, IdentifiedReference, Index, ManyToOne, PrimaryKey, Property, Unique } from '@mikro-orm/core';

@ObjectType()
@Entity()
@Unique({ properties: ['invitersId', 'inviteesId', 'hubId'] })
export class Invite {
  @Field(() => ID)
  @PrimaryKey()
  public id: number;

  @Field(() => ID)
  @Property({ fieldName: 'invitersId'})
  public invitersId: number;

  @Field(() => ID)
  @Property({ fieldName: 'inviteesId'})
  public inviteesId: number;

  @Field(() => ID)
  @Property({ fieldName: 'hubId'})
  public hubId: number;

  @Field(() => Boolean)
  @Property({ default: false })
  public accepted: boolean;

  @Field(() => User)
  @ManyToOne({ 
    entity: () => User,
    fieldName: 'invitersId',
    onDelete: 'cascade'
  })
  public inviter!: IdentifiedReference<User>;

  @Field(() => User)
  @ManyToOne({
    entity: () => User,
    fieldName: 'inviteesId',
    onDelete: 'cascade'
  })
  public invitee!: IdentifiedReference<User>;

  @Field(() => Hub)
  @ManyToOne({ 
    entity: () => Hub, 
    fieldName: 'hubId',
    onDelete: 'cascade'
  })
  public hub!: IdentifiedReference<Hub>;
}
