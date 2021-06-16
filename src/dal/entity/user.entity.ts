import { Logger } from '@nestjs/common';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { JoinUserHub } from './joinUserHub.entity';
import { PasswordReset } from './passwordReset.entity';
import { UserDevice } from './userDevice.entity';
import { Invite } from './invite.entity';
import { InAppNotification } from './inAppNotification.entity';

@ObjectType()
@Entity()
export class User {
  private logger = new Logger(User.name, true);

  @Field(() => ID)
  @PrimaryGeneratedColumn()
  public id: number;

  @Field()
  @Column()
  public firstName: string;

  @Field()
  @Column()
  public lastName: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  public description: string;

  /**
   * Exposed as a field resolver
   */
  @Column({ nullable: true })
  public image: string;

  @Field()
  @Column()
  public email: string;

  @Column()
  public password: string;

  @OneToMany(
    () => InAppNotification,
    (inAppNotifications) => inAppNotifications.user,
  )
  public inAppNotifications: Promise<InAppNotification[]>;

  @OneToMany(() => JoinUserHub, (joinUserHub) => joinUserHub.user)
  public hubsConnection: Promise<JoinUserHub[]>;

  @OneToOne(() => PasswordReset, {
    cascade: true,
  })
  @JoinColumn()
  public passwordReset: Promise<PasswordReset>;

  @OneToMany(() => UserDevice, (userDevice) => userDevice.user)
  public userDevices: Promise<UserDevice[]>;

  @OneToMany(() => Invite, (invite) => invite.invitee)
  public invitesSent: Promise<Invite[]>;

  @OneToMany(() => Invite, (invite) => invite.inviter)
  public invitesReceived: Promise<Invite[]>;
}
