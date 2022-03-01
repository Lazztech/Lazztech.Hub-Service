import { Entity, IdentifiedReference, ManyToOne, PrimaryKey, Property, Unique } from '@mikro-orm/core';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Hub } from './hub.entity';
import { User } from './user.entity';

 /* eslint-disable */ // needed for mikroorm default value & type which conflicts with typescript-eslint/no-unused-vars
@ObjectType()
@Entity()
@Unique({ properties: ['inviter', 'invitee', 'hub'] })
export class Invite {
  @Field(() => ID)
  @PrimaryKey()
  public id!: number;

  @Field(() => Boolean)
  @Property({ default: false })
  public accepted: boolean = false;

  /**
   * Exposed as a field resolver
   */
  @ManyToOne({ 
    entity: () => User,
    fieldName: 'invitersId',
    onDelete: 'cascade',
    wrappedReference: true
  })
  public inviter!: IdentifiedReference<User>;

  /**
   * Exposed as a field resolver
   */
  @ManyToOne({
    entity: () => User,
    fieldName: 'inviteesId',
    onDelete: 'cascade',
    wrappedReference: true
  })
  public invitee!: IdentifiedReference<User>;

  /**
   * Exposed as a field resolver
   */
  @ManyToOne({ 
    entity: () => Hub, 
    fieldName: 'hubId',
    onDelete: 'cascade',
    wrappedReference: true
  })
  public hub!: IdentifiedReference<Hub>;
}
