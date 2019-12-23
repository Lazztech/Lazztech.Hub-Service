import { Field, ID, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { JoinUserInAppNotifications } from './joinUserInAppNotifications';

@ObjectType()
@Entity()
export class InAppNotification extends BaseEntity {
  @Field(type => ID)
  @PrimaryGeneratedColumn()
  public id: number;

  @Field()
  @Column()
  public text: string;

  @Field()
  @Column()
  public date: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  public thumbnail: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  public actionLink: string;

  @OneToMany(
    () => JoinUserInAppNotifications,
    joinUserInAppNotifications => joinUserInAppNotifications.user,
  )
  public usersConnection: JoinUserInAppNotifications[];
}
