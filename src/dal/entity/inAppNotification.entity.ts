import { Entity, IdentifiedReference, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { User } from './user.entity';

@ObjectType()
@Entity()
export class InAppNotification {
  @Field(() => ID)
  @PrimaryKey()
  public id: number;

  @Field(() => ID)
  @Property({ fieldName: 'userId' })
  public userId: number;

  @Field({ nullable: true })
  @Property({ nullable: true })
  public header: string;

  @Field()
  @Property()
  public text: string;

  @Field()
  @Property()
  public date: string;

  /**
   * Handled by a field resolver
   */
  @Property({ nullable: true })
  public thumbnail: string;

  @Field({ nullable: true })
  @Property({ fieldName: 'actionLink', nullable: true })
  public actionLink: string;

  @ManyToOne({
    entity: () => User,
    onDelete: 'CASCADE',
    joinColumn: 'userId'
  })
  public user: IdentifiedReference<User>;
}
