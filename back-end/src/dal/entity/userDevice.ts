import { Field, ID } from 'type-graphql';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user';

@Entity()
export class UserDevice extends BaseEntity {
  @Field(type => ID)
  @PrimaryGeneratedColumn()
  public id: number;

  @Column("text", { unique: true })
  @Column()
  public fcmPushUserToken: string;

  @Column()
  public userId: number;

  @ManyToOne(
    () => User,
    user => user.userDevices,
    { primary: true, onDelete: 'CASCADE' },
  )
  public user: User;
}
