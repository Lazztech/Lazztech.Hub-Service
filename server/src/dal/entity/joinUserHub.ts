import { ObjectType, ID, Field } from "type-graphql";
import { Entity, PrimaryGeneratedColumn, BaseEntity, PrimaryColumn, ManyToOne, JoinColumn, Column } from "typeorm";
import { User } from "./user";
import { Hub } from "./hub";

@ObjectType()
@Entity()
export class JoinUserHub extends BaseEntity {

    @Field((type) => ID)
    @PrimaryColumn()
    public userId: number;

    @Field((type) => ID)
    @PrimaryColumn()
    public hubId: number;

    @Field((type) => User)
    @ManyToOne(() => User, (user) => user.hubsConnection, { primary: true, onDelete: "CASCADE" })
    @JoinColumn()
    public user: User;

    @Field((type) => Hub)
    @ManyToOne(() => Hub, (hub) => hub.usersConnection)
    @JoinColumn()
    public hub: Hub;

    @Field()
    @Column()
    public isOwner: boolean;

}