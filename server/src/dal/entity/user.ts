import { Field, ID, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { JoinUserGroup } from "./joinUserGroup";
import { JoinUserInAppNotifications } from "./joinUserInAppNotifications";
import { PasswordReset } from "./passwordReset";
import { UserDevice } from "./userDevice";

@ObjectType()
@Entity()
export class User extends BaseEntity {

    @Field((type) => ID)
    @PrimaryGeneratedColumn()
    public id: number;

    @Field()
    @Column()
    public firstName: string;

    @Field()
    @Column()
    public lastName: string;

    @Field()
    @Column("text", { unique: true })
    public email: string;

    @Column()
    public password: string;

    @OneToMany(
        () => JoinUserInAppNotifications,
        (userInAppNotificationsJoin) => userInAppNotificationsJoin.user,
    )
    public inAppNotificationsConnection: JoinUserInAppNotifications[];

    @OneToMany((type) => JoinUserGroup, (userGroupJoin) => userGroupJoin.user)
    public groupsConnection: JoinUserGroup[];

    @OneToOne(() => PasswordReset, {
        cascade: true
    })
    @JoinColumn()
    public passwordReset: PasswordReset;

    @OneToMany(() => UserDevice, (userDevice) => userDevice.user)
    public userDevices: UserDevice[];
}
