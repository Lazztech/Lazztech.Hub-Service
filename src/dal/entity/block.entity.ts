import { Entity, IdentifiedReference, ManyToOne, PrimaryKey } from '@mikro-orm/core';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { User } from './user.entity';

@ObjectType()
@Entity()
export class Block {
    @ManyToOne({
        entity: () => User,
        onDelete: 'cascade', 
        primary: true,
        wrappedReference: true,
    })
    public from!: IdentifiedReference<User>;

    @ManyToOne({
        entity: () => User,
        onDelete: 'cascade', 
        primary: true,
        wrappedReference: true
    })
    public to!: IdentifiedReference<User>;
}
