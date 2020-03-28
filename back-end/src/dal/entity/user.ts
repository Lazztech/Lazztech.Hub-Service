import { Logger } from '@nestjs/common';
import { Field, ID, ObjectType } from 'type-graphql';
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { JoinUserHub } from './joinUserHub';
import { JoinUserInAppNotifications } from './joinUserInAppNotifications';
import { PasswordReset } from './passwordReset';
import { UserDevice } from './userDevice';

@ObjectType()
@Entity()
export class User {
  private logger = new Logger(User.name, true);

  @Field(type => ID)
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

  @Field({ nullable: true })
  @Column({ nullable: true })
  public image: string;

  @Field()
  @Column()
  public email: string;

  @Column()
  public password: string;

  @OneToMany(
    () => JoinUserInAppNotifications,
    userInAppNotificationsJoin => userInAppNotificationsJoin.user,
  )
  public inAppNotificationsConnection: JoinUserInAppNotifications[];

  @OneToMany(
    type => JoinUserHub,
    joinUserHub => joinUserHub.user,
  )
  public hubsConnection: JoinUserHub[];

  @OneToOne(() => PasswordReset, {
    cascade: true,
  })
  @JoinColumn()
  public passwordReset: PasswordReset;

  @OneToMany(
    () => UserDevice,
    userDevice => userDevice.user,
  )
  public userDevices: UserDevice[];

}
