import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { User } from './user.entity';

@ObjectType()
@Entity()
export class UserDevice {
  @Field(() => ID)
  @PrimaryKey()
  public id: number;

  @Field()
  @Property({ unique: true })
  public fcmPushUserToken: string;

  @Property()
  public userId: number;

  @ManyToOne({
    primary: true,
    onDelete: 'CASCADE',
  })
  public user: Promise<User>;
}
