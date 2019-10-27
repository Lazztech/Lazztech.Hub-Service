import { verify } from "jsonwebtoken";
import { Arg, Authorized, Ctx, Int, Mutation, Resolver } from "type-graphql";
import { Group } from "../../dal/entity/group";
import { JoinUserGroup } from "../../dal/entity/joinUserGroup";
import { User } from "../../dal/entity/user";
import { IMyContext } from "../context.interface";

@Resolver()
export class UserGroupResolver {

    @Authorized()
    @Mutation(() => JoinUserGroup)
    public async addNewUserGroup(
        @Arg("locationName") locationName: string,
        @Ctx() ctx: IMyContext
    ): Promise<JoinUserGroup> {
        try {
            const accessToken = ctx.req.cookies["access-token"];
            const data = verify(accessToken, process.env.ACCESS_TOKEN_SECRET) as any;

            const group = await Group.create({ name: locationName }).save();
            let joinUserGroup = await JoinUserGroup.create({
                userId: data.userId,
                locationId: group.id,
            }).save();
            joinUserGroup = await JoinUserGroup.findOne({
                where: { locationId: group.id, userId: data.userId },
                relations: ["group", "user"]
            });

            return joinUserGroup;
        } catch (error) {
            console.error(error);
        }
    }

    @Authorized()
    @Mutation(() => JoinUserGroup)
    public async addNewUserToLocation(
        @Arg("userId", () => Int) userId: number,
        @Arg("locationId", () => Int) locationId: number,
        @Ctx() ctx: IMyContext
    ): Promise<JoinUserGroup> {
        try {
            const userToBeAdded = await User.findOne({ where: { id: userId } });
            if (!userToBeAdded) {
                throw new Error("User not found.");
            }
            let userGroup = await JoinUserGroup.findOne({ where: { userId, locationId }});
            if (!userGroup) {
                throw new Error("User already in that group.");
            }

            userGroup = await JoinUserGroup.create({
                userId,
                locationId
            }).save();
            userGroup = await JoinUserGroup.findOne({
                where: { locationId, userId },
                relations: ["group", "user"]
            });

            return userGroup;
        } catch (error) {
            console.error(error);
        }
    }

}
