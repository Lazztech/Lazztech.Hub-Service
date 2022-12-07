import { Field, ID, ObjectType } from '@nestjs/graphql';
import { InAppNotification } from './inAppNotification.entity';
import { Invite } from './invite.entity';
import { JoinUserHub } from './joinUserHub.entity';
import { PasswordReset } from './passwordReset.entity';
import { UserDevice } from './userDevice.entity';
import { ShareableId } from './shareableId.entity';
import { Block } from './block.entity';
import { Cascade, Collection, Entity, IdentifiedReference, OneToMany, OneToOne, PrimaryKey, Property, Unique } from '@mikro-orm/core';

 /* eslint-disable */ // needed for mikroorm default value & type which conflicts with typescript-eslint/no-unused-vars
@ObjectType()
@Entity()
export class User extends ShareableId{
  @Field(() => ID)
  @PrimaryKey()
  public id!: number;

  @Field()
  @Property({ nullable: true })
  public username?: string;

  @Field()
  @Property({ fieldName: 'firstName', nullable: true })
  public firstName?: string;

  @Field()
  @Property({ fieldName: 'lastName', nullable: true })
  public lastName?: string;

  @Field({
    nullable: true,
    description: 'string representation of unix timestamp',
  })
  @Property({ nullable: true })
  public birthdate?: string;

  @Field({ nullable: true })
  @Property({ nullable: true })
  public description?: string;

  /**
   * Exposed as a field resolver
   */
  @Property({ nullable: true })
  public image?: string;

  @Field()
  @Unique()
  @Property({ nullable: true })
  public email?: string;

  @Field({ nullable: true })
  @Property({ nullable: true })
  public phoneNumber?: string;

  @Property()
  public password!: string;

  @Field({ nullable: true, description: 'unix timestamp for the last time the user was successfully authenticated' })
  @Property({ nullable: true })
  public lastOnline?: string;

  @OneToMany(
    () => InAppNotification,
    (inAppNotifications) => inAppNotifications.user,
  )
  public inAppNotifications = new Collection<InAppNotification>(this);

  @OneToMany(() => JoinUserHub, (joinUserHub) => joinUserHub.user)
  public hubsConnection = new Collection<JoinUserHub>(this);

  @OneToOne({
    entity: () => PasswordReset,
    cascade: [Cascade.ALL],
    fieldName: 'passwordResetId',
    nullable: true,
    wrappedReference: true,
    inversedBy: 'user',
  })
  public passwordReset!: IdentifiedReference<PasswordReset>;

  /**
   * Exposed as a field resolver
   */
  @OneToMany(() => UserDevice, (userDevice) => userDevice.user)
  public userDevices = new Collection<UserDevice>(this);

  @OneToMany(() => Invite, (invite) => invite.invitee)
  public invitesSent = new Collection<Invite>(this);

  @OneToMany(() => Invite, (invite) => invite.inviter)
  public invitesReceived = new Collection<Invite>(this);

  /**
   * Exposed as a field resolver
   */
  @OneToMany(() => Block, (block) => block.from)
  public blocks = new Collection<Block>(this);

  /**
   * Not exposed out
   */
  @OneToMany(() => Block, (block) => block.to)
  public blockedBy = new Collection<Block>(this);

  @Property({ nullable: true })
  public flagged?: boolean;

  @Property({ nullable: true })
  public banned?: boolean;
}
