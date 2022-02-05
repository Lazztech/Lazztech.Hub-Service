import { Field, ID, ObjectType } from '@nestjs/graphql';
import { InAppNotification } from './inAppNotification.entity';
import { Invite } from './invite.entity';
import { JoinUserHub } from './joinUserHub.entity';
import { PasswordReset } from './passwordReset.entity';
import { UserDevice } from './userDevice.entity';
import { ShareableId } from './shareableId.entity'
import { Cascade, Collection, Entity, OneToMany, OneToOne, PrimaryKey, Property } from '@mikro-orm/core';

@ObjectType()
@Entity()
export class User extends ShareableId{
  @Field(() => ID)
  @PrimaryKey()
  public id!: number;

  @Field()
  @Property({ fieldName: 'firstName' })
  public firstName!: string;

  @Field()
  @Property({ fieldName: 'lastName' })
  public lastName!: string;

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
  @Property()
  public email!: string;

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
    cascade: [Cascade.ALL],
    fieldName: 'passwordResetId',
    nullable: true
  })
  public passwordReset!: PasswordReset;

  /**
   * Exposed as a field resolver
   */
  @OneToMany(() => UserDevice, (userDevice) => userDevice.user)
  public userDevices = new Collection<UserDevice>(this);

  @OneToMany(() => Invite, (invite) => invite.invitee)
  public invitesSent = new Collection<Invite>(this);

  @OneToMany(() => Invite, (invite) => invite.inviter)
  public invitesReceived = new Collection<Invite>(this);
}
