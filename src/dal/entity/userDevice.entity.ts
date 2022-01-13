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
  @Property({ fieldName: 'fcmPushUserToken', unique: true })
  public fcmPushUserToken: string;

  @Property()
  public userId: number;

  @ManyToOne({
    entity: () => User,
    primary: true,
    onDelete: 'CASCADE',
  })
  public user: User;
}
