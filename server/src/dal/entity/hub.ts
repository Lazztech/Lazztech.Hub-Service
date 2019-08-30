import { ObjectType, Field, ID } from "type-graphql";
import { Entity, BaseEntity, PrimaryGeneratedColumn, ManyToOne, OneToMany, Column } from "typeorm";
import { JoinUserHub } from "./joinUserHub";
import { User } from "./user";

@ObjectType()
@Entity()
export class Hub extends BaseEntity {

    @Field((type) => ID)
    @PrimaryGeneratedColumn()
    public id: number;

    @Field()
    @Column()
    public name: string;

    @Field()
    @Column()
    public image: string;

    @OneToMany((type) => JoinUserHub, (joinUserHub) => joinUserHub.hub)
    public usersConnection: JoinUserHub[];

    @Field(() => [User])
    public async owners(): Promise<User[]> {
        const joinUserHubResults = await JoinUserHub.find({
            where: {
                hubId: this.id,
                isOwner: true
            },
            relations: ["user"]
        });
        const owners: User[] = [];
        joinUserHubResults.forEach((result) => {
            const user = result.user;
            owners.push(user);
        });

        return owners;
    } 

    @Field(() => [User])
    public async members(): Promise<User[]> {
        const joinUserHubResults = await JoinUserHub.find({
            where: {
                hubId: this.id,
                isOwner: false
            },
            relations: ["user"]
        });
        const members: User[] = [];
        joinUserHubResults.forEach((result) => {
            const user = result.user;
            members.push(user);
        });

        return members;
    }

}