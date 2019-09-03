import { verify } from "jsonwebtoken";
import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { Hub } from "../../dal/entity/hub";
import { JoinUserHub } from "../../dal/entity/joinUserHub";
import { User } from "../../dal/entity/user";
import { IMyContext } from "../context.interface";

@Resolver()
export class HubResolver {

    // constructor() {}

    @Authorized()
    @Mutation(() => User)
    public async createHub(
        @Ctx() ctx: IMyContext,
        @Arg("name") name: string,
        @Arg("image") image: string
    ): Promise<User> {
        let accessToken = ctx.req.cookies["access-token"];
        if (!accessToken) {
            accessToken = ctx.req.get("Authorization");
        }
        if (!accessToken) {
            console.error("Didn't find access token!");
        }

        const data = verify(accessToken, process.env.ACCESS_TOKEN_SECRET) as any;

        // Creates hub with user as owner.
        const hub = Hub.create({
            name,
            image
        });
        const result = await hub.save();
        let joinUserHub = await JoinUserHub.create({
            userId: data.userId,
            hubId: hub.id
        });
        joinUserHub = await joinUserHub.save();

        const user = await User.findOne({ where: { id: data.userId}});

        return user;
    }

    @Authorized()
    @Query(() => [Hub])
    public async ownedHubs(
        @Ctx() ctx: IMyContext,
    ): Promise<Hub[]> {
        let accessToken = ctx.req.cookies["access-token"];
        if (!accessToken) {
            accessToken = ctx.req.get("Authorization");
        }
        if (!accessToken) {
            console.error("Didn't find access token!");
        }

        const data = verify(accessToken, process.env.ACCESS_TOKEN_SECRET) as any;

        const user = await User.findOne({ id: data.userId });
        const ownedHubs = await user.ownedHubs();
        return ownedHubs;
    }

    @Authorized()
    @Query(() => [Hub])
    public async memberOfHubs(
        @Ctx() ctx: IMyContext,
    ): Promise<Hub[]> {
        let accessToken = ctx.req.cookies["access-token"];
        if (!accessToken) {
            accessToken = ctx.req.get("Authorization");
        }
        if (!accessToken) {
            console.error("Didn't find access token!");
        }

        const data = verify(accessToken, process.env.ACCESS_TOKEN_SECRET) as any;

        const user = await User.findOne({ id: data.userId });
        const memberOfHubs = await user.memberOfHubs();
        return memberOfHubs;
    }

    @Authorized()
    @Mutation(() => Hub)
    public async renameHub(
        @Ctx() ctx: IMyContext,
        @Arg("hubId") hubId: number,
        @Arg("newName") newName: string
    ): Promise<Hub> {
        let accessToken = ctx.req.cookies["access-token"];
        if (!accessToken) {
            accessToken = ctx.req.get("Authorization");
        }
        if (!accessToken) {
            console.error("Didn't find access token!");
        }

        const data = verify(accessToken, process.env.ACCESS_TOKEN_SECRET) as any;

        const joinUserHubResult = await JoinUserHub.findOne({
            where: {
                userId: data.userId,
                hubId,
                isOwner: true
            },
            relations: ["hub"]
        });

        let hub = joinUserHubResult.hub;
        hub.name = newName;
        hub = await hub.save();
        return hub;
    }

    @Authorized()
    @Mutation(() => Hub)
    public async changeHubImage(
        @Ctx() ctx: IMyContext,
        @Arg("hubId") hubId: number,
        @Arg("newImage") newImage: string
    ): Promise<Hub> {
        let accessToken = ctx.req.cookies["access-token"];
        if (!accessToken) {
            accessToken = ctx.req.get("Authorization");
        }
        if (!accessToken) {
            console.error("Didn't find access token!");
        }

        const data = verify(accessToken, process.env.ACCESS_TOKEN_SECRET) as any;

        const joinUserHubResult = await JoinUserHub.findOne({
            where: {
                userId: data.userId,
                hubId,
                isOwner: true
            },
            relations: ["hub"]
        });

        let hub = joinUserHubResult.hub;
        hub.image = newImage;
        hub = await hub.save();
        return hub;
    }

}
