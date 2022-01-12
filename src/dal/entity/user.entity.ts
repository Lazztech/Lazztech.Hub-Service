import { Field, ID, ObjectType } from '@nestjs/graphql';
import { InAppNotification } from './inAppNotification.entity';
import { Invite } from './invite.entity';
import { JoinUserHub } from './joinUserHub.entity';
import { PasswordReset } from './passwordReset.entity';
import { UserDevice } from './userDevice.entity';
import { ShareableId } from './shareableId.entity'
import { Cascade, Entity, OneToMany, OneToOne, PrimaryKey, Property } from '@mikro-orm/core';

@ObjectType()
@Entity()
export class User extends ShareableId{
  @Field(() => ID)
  @PrimaryKey()
  public id: number;

  @Field()
  @Property({ fieldName: 'firstName' })
  public firstName: string;

  @Field()
  @Property({ fieldName: 'lastName' })
  public lastName: string;

  @Field({
    nullable: true,
    description: 'string representation of unix timestamp',
  })
  @Property({ nullable: true })
  public birthdate: string;

  @Field({ nullable: true })
  @Property({ nullable: true })
  public description: string;

  /**
   * Exposed as a field resolver
   */
  @Property({ nullable: true })
  public image: string;

  @Field()
  @Property()
  public email: string;

  @Property()
  public password: string;

  @OneToMany(
    () => InAppNotification,
    (inAppNotifications) => inAppNotifications.user,
  )
  public inAppNotifications: InAppNotification[];

  @OneToMany(() => JoinUserHub, (joinUserHub) => joinUserHub.user)
  public hubsConnection: JoinUserHub[];

  @OneToOne({
    cascade: [Cascade.ALL],
  })
  public passwordReset: PasswordReset;

  /**
   * Exposed as a field resolver
   */
  @OneToMany(() => UserDevice, (userDevice) => userDevice.user)
  public userDevices: UserDevice[];

  @OneToMany(() => Invite, (invite) => invite.invitee)
  public invitesSent: Invite[];

  @OneToMany(() => Invite, (invite) => invite.inviter)
  public invitesReceived: Invite[];
}
