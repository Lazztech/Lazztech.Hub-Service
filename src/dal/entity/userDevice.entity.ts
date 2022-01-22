import { Entity, IdentifiedReference, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
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

  @ManyToOne(() => User, { mapToPk: true })
  public userId: number;

  @ManyToOne({
    entity: () => User,
    fieldName: 'userId',
    onDelete: 'cascade',
    wrappedReference: true
  })
  public user: IdentifiedReference<User>;
}
