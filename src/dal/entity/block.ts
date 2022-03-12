import { Entity, IdentifiedReference, ManyToOne, PrimaryKey } from '@mikro-orm/core';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { User } from './user.entity';

@ObjectType()
@Entity()
export class Block {
    @Field(() => ID)
    @PrimaryKey()
    public id!: number;

    @ManyToOne({
        entity: () => User,
        wrappedReference: true
    })
    public from!: IdentifiedReference<User>;

    @ManyToOne({
        entity: () => User,
        wrappedReference: true
    })
    public to!: IdentifiedReference<User>;
}
