import { Entity, Ref, OneToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { Field, ID } from '@nestjs/graphql';
import { User } from './user.entity';

@Entity()
export class PasswordReset {
  @Field(() => ID)
  @PrimaryKey()
  public id!: number;

  @Property()
  public pin!: string;

  @OneToOne({
    entity: () => User,
    nullable: false,
    ref: true,
    mappedBy: 'passwordReset'
  })
  public user!: Ref<User>;
}
