import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@ObjectType()
@Entity()
export class UserDevice {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  public id: number;

  @Field()
  @Column('text', { unique: true })
  public fcmPushUserToken: string;

  @Column()
  public userId: number;

  @ManyToOne(() => User, (user) => user.userDevices, {
    primary: true,
    onDelete: 'CASCADE',
  })
  public user: Promise<User>;
}
