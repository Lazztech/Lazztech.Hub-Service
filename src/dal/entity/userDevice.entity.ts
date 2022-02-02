import { Entity, IdentifiedReference, ManyToOne, PrimaryKey, Property, Unique } from '@mikro-orm/core';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { User } from './user.entity';

@ObjectType()
@Entity()
export class UserDevice {
  @Field(() => ID)
  @PrimaryKey()
  public id: number;

  @Field()
  @Unique()
  @Property({ fieldName: 'fcmPushUserToken' })
  public fcmPushUserToken: string;

  @ManyToOne({
    entity: () => User,
    fieldName: 'userId',
    onDelete: 'cascade',
    wrappedReference: true
  })
  public user: IdentifiedReference<User>;
}
