import { verify } from "jsonwebtoken";
import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { Hub } from "../../dal/entity/hub";
import { JoinUserHub } from "../../dal/entity/joinUserHub";
import { User } from "../../dal/entity/user";
import { IMyContext } from "../context.interface";
import jsQR, { QRCode } from "jsqr";
import fs from "fs";
import sizeOf from "image-size";

@Resolver()
export class HubResolver {

    // constructor() {}

    @Authorized()
    @Mutation(() => Hub)
    public async createHub(
        @Ctx() ctx: IMyContext,
        @Arg("name") name: string,
        @Arg("image") image: string
    ): Promise<Hub> {
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
            hubId: hub.id,
            isOwner: true
        });
        joinUserHub = await joinUserHub.save();
        return hub;
    }

    @Authorized()
    @Query(() => Hub)
    public async hub(
        @Ctx() ctx: IMyContext,
        @Arg("id") id: number,
    ): Promise<Hub> {
        let accessToken = ctx.req.cookies["access-token"];
        if (!accessToken) {
            accessToken = ctx.req.get("Authorization");
        }
        if (!accessToken) {
            console.error("Didn't find access token!");
        }
        // Need to add check that user is either a member or owner.

        const data = verify(accessToken, process.env.ACCESS_TOKEN_SECRET) as any;

        const user = await User.findOne({ id: data.userId });

        const hub = await Hub.findOne({ id });
        return hub;
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

        // Finish implementing check that user is hub owner.
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

        // Finish implementing check that user is hub owner.

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

    @Authorized()
    @Mutation(() => Boolean)
    public async joinHub(
        @Ctx() ctx: IMyContext,
        @Arg("id") id: number,
    ) {
        let accessToken = ctx.req.cookies["access-token"];
        if (!accessToken) {
            accessToken = ctx.req.get("Authorization");
        }
        if (!accessToken) {
            console.error("Didn't find access token!");
        }

        // Finish implementing check that user is hub owner.
        const data = verify(accessToken, process.env.ACCESS_TOKEN_SECRET) as any;

        let joinUserHub = await JoinUserHub.create({
            userId: data.userId,
            hubId: id,
            isOwner: true
        });
        joinUserHub = await joinUserHub.save();
        
        return true;
    }

    @Authorized()
    @Query(() => Hub)
    public async getHubByQRImage(
        @Ctx() ctx: IMyContext,
        @Arg("qrImageB64") qrImageB64: string
    ): Promise<Hub> {
        let accessToken = ctx.req.cookies["access-token"];
        if (!accessToken) {
            accessToken = ctx.req.get("Authorization");
        }
        if (!accessToken) {
            console.error("Didn't find access token!");
        }

        // Finish implementing check that user is hub owner.
        const data = verify(accessToken, process.env.ACCESS_TOKEN_SECRET) as any;

        const id = await this.scanQR(qrImageB64);
        if (id) {
            const hub = await Hub.findOne({ id });
            return hub;
        }
    }

    
      async scanQR(base64: string): Promise<any> {
        let buff = new Buffer(base64, 'base64');
        fs.writeFileSync('stack-abuse-logo-out.png', buff);
        const data = new Uint8ClampedArray(buff);
        const dimensions = sizeOf(base64);
        const qrCode: QRCode = jsQR(data, dimensions.width, dimensions.height);
        if (qrCode) {
            return JSON.parse(qrCode.data);
        } 
        else {
            console.error("failed to decode qr code.");
        } 
      }

}
