import { Entity, IdentifiedReference, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Hub } from './hub.entity';

@ObjectType()
@Entity()
export class MicroChat {
  @Field(() => ID)
  @PrimaryKey()
  public id: number;

  @Field()
  @Property({ fieldName: 'hubId'})
  public hubId: number;

  @Field(() => ID)
  @ManyToOne({
    entity: () => Hub,
    onDelete: 'cascade',
    fieldName: 'hubId',
    wrappedReference: true
  })
  public hub: IdentifiedReference<Hub>;

  @Field()
  @Property()
  public text: string;
}
