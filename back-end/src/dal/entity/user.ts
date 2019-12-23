import { Field, ID, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Hub } from './hub';
import { JoinUserHub } from './joinUserHub';
import { JoinUserInAppNotifications } from './joinUserInAppNotifications';
import { JoinUserLocation } from './joinUserLocation';
import { PasswordReset } from './passwordReset';
import { UserDevice } from './userDevice';

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field(type => ID)
  @PrimaryGeneratedColumn()
  public id: number;

  @Field()
  @Column()
  public firstName: string;

  @Field()
  @Column()
  public lastName: string;

  @Field()
  // @Column("text", { unique: true })
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

  @OneToMany(
    type => JoinUserLocation,
    userLocation => userLocation.user,
  )
  public locationsConnection: JoinUserLocation[];

  @Field(() => [Hub])
  public async ownedHubs(): Promise<Hub[]> {
    const joinUserHubResults = await JoinUserHub.find({
      where: {
        userId: this.id,
        isOwner: true,
      },
      relations: ['hub'],
    });
    const hubs: Hub[] = [];
    joinUserHubResults.forEach(result => {
      hubs.push(result.hub);
    });
    return hubs;
  }

  @Field(() => [Hub])
  public async memberOfHubs(): Promise<Hub[]> {
    const joinUserHubResults = await JoinUserHub.find({
      where: {
        userId: this.id,
        isOwner: false,
      },
      relations: ['hub'],
    });
    const hubs: Hub[] = [];
    joinUserHubResults.forEach(result => {
      hubs.push(result.hub);
    });
    return hubs;
  }
}
