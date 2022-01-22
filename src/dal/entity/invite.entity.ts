import { Entity, IdentifiedReference, ManyToOne, PrimaryKey, Property, Unique } from '@mikro-orm/core';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Hub } from './hub.entity';
import { User } from './user.entity';

@ObjectType()
@Entity()
@Unique({ properties: ['inviter', 'invitee', 'hub'] })
export class Invite {
  @Field(() => ID)
  @PrimaryKey()
  public id: number;

  @Field(() => Boolean)
  @Property({ default: false })
  public accepted: boolean;

  @Field(() => User)
  @ManyToOne({ 
    entity: () => User,
    fieldName: 'invitersId',
    onDelete: 'cascade',
    wrappedReference: true
  })
  public inviter!: IdentifiedReference<User>;

  @Field(() => User)
  @ManyToOne({
    entity: () => User,
    fieldName: 'inviteesId',
    onDelete: 'cascade',
    wrappedReference: true
  })
  public invitee!: IdentifiedReference<User>;

  @Field(() => Hub)
  @ManyToOne({ 
    entity: () => Hub, 
    fieldName: 'hubId',
    onDelete: 'cascade',
    wrappedReference: true
  })
  public hub!: IdentifiedReference<Hub>;
}
