import { BarcodeFormat, BinaryBitmap, DecodeHintType, HybridBinarizer, MultiFormatReader, RGBLuminanceSource } from '@zxing/library/esm5';
import jpeg from "jpeg-js";
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

        const result = await this.scanQR(qrImageB64);
        if (result) {
            const id = result.id;
            const hub = await Hub.findOne({ id });
            return hub;
        }
    }

      public async scanQR(base64: string): Promise<any> {
        const buff = Buffer.from(base64.substr(23), 'base64');
        console.log("created buff");

        const rawImageData = jpeg.decode(buff);

        const hints = new Map();
        const formats = [BarcodeFormat.QR_CODE, BarcodeFormat.DATA_MATRIX];
         
        hints.set(DecodeHintType.POSSIBLE_FORMATS, formats);
        hints.set(DecodeHintType.TRY_HARDER, true);
         
        const reader = new MultiFormatReader();
         
        reader.setHints(hints);
        
        const len = rawImageData.width * rawImageData.height;
        
        const luminancesUint8Array = new Uint8ClampedArray(len);
        
        for(let i = 0; i < len; i++){
            luminancesUint8Array[i] = ((rawImageData.data[i*4]+rawImageData.data[i*4+1]*2+rawImageData.data[i*4+2]) / 4) & 0xFF;
        }
        
        const luminanceSource = new RGBLuminanceSource(luminancesUint8Array, rawImageData.width, rawImageData.height);
        
        console.log(luminanceSource)
        
        const binaryBitmap = new BinaryBitmap(new HybridBinarizer(luminanceSource));
        
        const qrCode = reader.decode(binaryBitmap);
        
        console.log(qrCode);

        if (qrCode) {
            return JSON.parse(qrCode.getText());
        } else {
            console.error("failed to decode qr code.");
        }
      }

}
