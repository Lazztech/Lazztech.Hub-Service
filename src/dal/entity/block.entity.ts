import { Entity, Ref, ManyToOne } from '@mikro-orm/core';
import { ObjectType } from '@nestjs/graphql';
import { User } from './user.entity';

@ObjectType()
@Entity()
export class Block {
  @ManyToOne({
    entity: () => User,
    deleteRule: 'cascade',
    primary: true,
    ref: true,
  })
  public from!: Ref<User>;

  @ManyToOne({
    entity: () => User,
    deleteRule: 'cascade',
    primary: true,
    ref: true
  })
  public to!: Ref<User>;
}
