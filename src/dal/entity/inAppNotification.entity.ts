import { Field, ID, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@ObjectType()
@Entity()
export class InAppNotification {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  public id: number;

  @Field(() => ID)
  @Column()
  public userId: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  public header: string;

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

  @ManyToOne(() => User, (user) => user.inAppNotifications, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  public user: Promise<User>;
}
