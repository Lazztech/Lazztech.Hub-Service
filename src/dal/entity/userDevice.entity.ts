import { Entity, IdentifiedReference, ManyToOne, PrimaryKey, Property, Unique } from '@mikro-orm/core';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { User } from './user.entity';
import webpush from 'web-push';

@ObjectType()
@Entity()
export class UserDevice {
  @Field(() => ID)
  @PrimaryKey()
  public id!: number;

  @Field()
  @Unique()
  @Property({ fieldName: 'fcmPushUserToken', nullable: true })
  public fcmPushUserToken!: string;

  @Property({ type: 'json', nullable: true })
  webPushSubscription?: webpush.PushSubscription;

  @ManyToOne({
    entity: () => User,
    fieldName: 'userId',
    onDelete: 'cascade',
    wrappedReference: true
  })
  public user!: IdentifiedReference<User>;
}
