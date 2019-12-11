import { BarcodeFormat, BinaryBitmap, DecodeHintType, HybridBinarizer, MultiFormatReader, RGBLuminanceSource } from "@zxing/library/esm5";
import jpeg from "jpeg-js";
import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { Hub } from "../../dal/entity/hub";
import { JoinUserHub } from "../../dal/entity/joinUserHub";
import { User } from "../../dal/entity/user";
import { IsLatitude } from "class-validator";

@Resolver()
export class HubResolver {

    // constructor() {}

    @Authorized()
    @Mutation(() => Hub)
    public async createHub(
        @Ctx() ctx: any, //FIXME: should be an interface
        @Arg("name") name: string,
        @Arg("image") image: string,
        @Arg("latitude") latitude: number,
        @Arg("longitude") longitude: number
    ): Promise<Hub> {
        // Creates hub with user as owner.
        const hub = Hub.create({
            latitude,
            longitude,
            name,
            image
        });
        const result = await hub.save();
        let joinUserHub = await JoinUserHub.create({
            userId: ctx.userId,
            hubId: hub.id,
            isOwner: true
        });
        joinUserHub = await joinUserHub.save();
        return hub;
    }

    @Authorized()
    @Query(() => Hub)
    public async hub(
        @Ctx() ctx: any, //FIXME: should be an interface
        @Arg("id") id: number,
    ): Promise<Hub> {
        //FIXME: Need to add check that user is either a member or owner.
        // const user = await User.findOne({ id: ctx.userId });

        // const hub = await Hub.findOne({ 
        //     where: {id},
        //     relations: ["usersConnection"]
        //  });
        const userHubRelationship = await JoinUserHub.findOne({
            where: {
                hubId: id,
                userId: ctx.userId
            }, 
            relations: ["hub"]
        });
        userHubRelationship.hub.starred = userHubRelationship.starred;
        return userHubRelationship.hub;
    }

    @Authorized()
    @Query(() => [Hub])
    public async ownedHubs(
        @Ctx() ctx: any, //FIXME: should be an interface
    ): Promise<Hub[]> {
        const user = await User.findOne({ id: ctx.userId });
        const ownedHubs = await user.ownedHubs();
        return ownedHubs;
    }

    @Authorized()
    @Query(() => [Hub])
    public async memberOfHubs(
        @Ctx() ctx: any, //FIXME: should be an interface
    ): Promise<Hub[]> {
        const user = await User.findOne({ id: ctx.userId });
        const memberOfHubs = await user.memberOfHubs();
        return memberOfHubs;
    }

    @Authorized()
    @Mutation(() => Boolean)
    public async deleteHub(
        @Ctx() ctx: any, //FIXME: should be an interface
        @Arg("hubId") hubId: number,
    ) {
        const hub = await Hub.findOne({
            where: {
                id: hubId
            },
            // relations: ["usersConnection"]
        });
        await hub.remove();
        return true;
    }

    @Authorized()
    @Mutation(() => Hub)
    public async renameHub(
        @Ctx() ctx: any, //FIXME: should be an interface
        @Arg("hubId") hubId: number,
        @Arg("newName") newName: string
    ): Promise<Hub> {
        //FIXME: Finish implementing check that user is hub owner.

        const joinUserHubResult = await JoinUserHub.findOne({
            where: {
                userId: ctx.userId,
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
        @Ctx() ctx: any, //FIXME: should be an interface
        @Arg("hubId") hubId: number,
        @Arg("newImage") newImage: string
    ): Promise<Hub> {
        //FIXME: Finish implementing check that user is hub owner.

        const joinUserHubResult = await JoinUserHub.findOne({
            where: {
                userId: ctx.userId,
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
        @Ctx() ctx: any, //FIXME: should be an interface
        @Arg("id") id: number,
    ) {
        //FIXME: Finish implementing check that user is hub owner.

        let joinUserHub = await JoinUserHub.create({
            userId: ctx.userId,
            hubId: id,
            isOwner: true
        });
        joinUserHub = await joinUserHub.save();

        return true;
    }

    @Authorized()
    @Query(() => Hub)
    public async getHubByQRImage(
        @Ctx() ctx: any, //FIXME: should be an interface
        @Arg("qrImageB64") qrImageB64: string
    ): Promise<Hub> {
        //FIXME: Finish implementing check that user is hub owner.
        
        const result = await this.scanQR(qrImageB64);
        if (result) {
            const id = result.id;
            const hub = await Hub.findOne({ id });
            return hub;
        }
    }

    @Authorized()
    @Mutation(() => Boolean)
    public async setHubStarred(
        @Ctx() ctx: any, //FIXME: should be an interface
        @Arg("hubId") hubId: number,
    ) {
        const hubRelationship = await JoinUserHub.findOne({userId: ctx.userId, hubId: hubId});
        hubRelationship.starred = true;
        await hubRelationship.save();
        return true;
    }

    @Authorized()
    @Mutation(() => Boolean)
    public async setHubNotStarred(
        @Ctx() ctx: any, //FIXME: should be an interface
        @Arg("hubId") hubId: number,
    ) {
        const hubRelationship = await JoinUserHub.findOne({userId: ctx.userId, hubId: hubId});
        hubRelationship.starred = false;
        await hubRelationship.save();
        return true;
    }

    @Authorized()
    @Mutation(() => Boolean)
    public async updateHubPhoto(
        @Ctx() ctx: any, //FIXME: should be an interface
        @Arg("id") id: number,
        @Arg("image") image: string
    ): Promise<boolean> {
        let hub = await Hub.findOne({ id });
        hub.image = image;
        hub = await hub.save();
        return true;
    }

      public async scanQR(base64: string): Promise<any> {
        const buff = Buffer.from(base64.substr(23), "base64");
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

        for (let i = 0; i < len; i++) {
            // tslint:disable-next-line:no-bitwise
            luminancesUint8Array[i] = ((rawImageData.data[i * 4] + rawImageData.data[i * 4 + 1] * 2 + rawImageData.data[i * 4 + 2]) / 4) & 0xFF;
        }

        const luminanceSource = new RGBLuminanceSource(luminancesUint8Array, rawImageData.width, rawImageData.height);

        console.log(luminanceSource);

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
