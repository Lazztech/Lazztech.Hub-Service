import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { Field, ID } from '@nestjs/graphql';

@Entity()
export class PasswordReset {
  @Field(() => ID)
  @PrimaryKey()
  public id!: number;

  @Property()
  public pin!: string;
}
