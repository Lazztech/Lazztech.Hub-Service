import { ObjectType, Field, ID } from "type-graphql";
import { Entity, BaseEntity, PrimaryGeneratedColumn, Column } from "typeorm";

@ObjectType()
@Entity()
export class MicroChat extends BaseEntity {
    @Field(type => ID)
    @PrimaryGeneratedColumn()
    public id: number;

    @Field(type => ID)
    @Column()
    public hubId: number;

    @Field()
    @Column()
    public emoji: string;

    @Field()
    @Column()
    public text: string;
}