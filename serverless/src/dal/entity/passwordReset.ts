import { Field, ID } from "type-graphql";
import { BaseEntity, Column, Entity, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user";

@Entity()
export class PasswordReset extends BaseEntity {

    @Field((type) => ID)
    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public pin: string;

    // @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP"})
    @Column()
    public timestamp: string;

}
