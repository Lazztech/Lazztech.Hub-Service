import { ObjectType, Field, ID } from "type-graphql";
import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Hub } from "./hub";

@ObjectType()
@Entity()
export class MicroChat extends BaseEntity {
    @Field(type => ID)
    @PrimaryGeneratedColumn()
    public id: number;

    @Field()
    @PrimaryColumn()
    public hubId: number;

    @Field(type => ID)
    @ManyToOne(
        () => Hub,
        x => x.microChats,
        {
            onDelete: 'CASCADE'
        }
    )
    @JoinColumn()
    public hub: Hub;

    @Field()
    @Column()
    public text: string;


}