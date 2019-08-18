import { Field, ID, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { JoinUserGroup } from "./joinUserGroup";

@ObjectType()
@Entity()
export class Group extends BaseEntity {

    @Field((type) => ID)
    @PrimaryGeneratedColumn()
    public id: number;

    @Field()
    @Column({ nullable: true })
    public name: string;

    @Field()
    @Column({ nullable: true })
    public description: string;

    @OneToMany((type) => JoinUserGroup, (joinUserGroup) => joinUserGroup.group)
    public usersConnection: JoinUserGroup[];

}
