import { Field, ID, ObjectType } from 'type-graphql';
import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { InAppNotification } from './inAppNotification.entity';
import { User } from './user.entity';

@ObjectType()
@Entity()
export class JoinUserInAppNotifications {
  @Field(type => ID)
  @PrimaryColumn()
  public userId: number;

  @Field(type => ID)
  @PrimaryColumn({})
  public inAppNotificationId: number;

  @Field(type => User)
  @ManyToOne(
    () => User,
    user => user.inAppNotificationsConnection,
    { primary: true, onDelete: 'CASCADE' },
  )
  @JoinColumn()
  public user: User;

  @Field(type => InAppNotification)
  @ManyToOne(
    () => InAppNotification,
    inAppNotification => inAppNotification.usersConnection,
  )
  @JoinColumn()
  public inAppNotification: InAppNotification;
}
