import { Entity, IdentifiedReference, ManyToOne, PrimaryKey, Property, Unique } from "@mikro-orm/core";
import { Field, ID } from "@nestjs/graphql";
import { ShareableId } from "./shareableId.entity";
import { User } from './user.entity';

@Entity()
export class File extends ShareableId {
    @Field(() => ID)
    @PrimaryKey()
    public id!: number;

    @Field()
    @Unique()
    @Property()
    public fileName!: string;

    @Field({ nullable: true })
    @Property({ nullable: true })
    public mimetype?: string;

    @Field({ description: 'ISO 8601 Date Time' })
    @Property()
    public createdOn!: string;

    /**
     * Exposed as a field resolver
     */
    @ManyToOne({
        entity: () => User,
        fieldName: 'createdByUserId',
        wrappedReference: true,
    })
    public createdBy!: IdentifiedReference<User>;
}