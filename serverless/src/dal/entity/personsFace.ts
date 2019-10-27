import { Field, Float, ID, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@ObjectType()
@Entity()
export class PersonsFace extends BaseEntity {

    @Field(() => ID)
    @PrimaryGeneratedColumn()
    public id: number;

    @Field()
    @Column({ nullable: true })
    public name: string;

    @Field()
    @Column({ nullable: true })
    public image: string;

    @Field(() => [Float])
    @Column( "decimal", {array: true, nullable: true })
    public descriptor: number[];

}
