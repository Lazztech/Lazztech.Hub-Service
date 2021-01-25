import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { InAppNotification } from './inAppNotification.entity';
import { User } from './user.entity';

@ObjectType()
@Entity()
export class JoinUserInAppNotifications {
  @Field(() => ID)
  @PrimaryColumn()
  public userId: number;

  @Field(() => ID)
  @PrimaryColumn({})
  public inAppNotificationId: number;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.inAppNotificationsConnection, {
    primary: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  public user: Promise<User>;

  @Field(() => InAppNotification)
  @ManyToOne(
    () => InAppNotification,
    (inAppNotification) => inAppNotification.usersConnection,
  )
  @JoinColumn()
  public inAppNotification: Promise<InAppNotification>;
}
