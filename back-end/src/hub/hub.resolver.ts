import { UseGuards } from '@nestjs/common';
import { Mutation, Query, Resolver, Args } from '@nestjs/graphql';
import { UserId } from 'src/decorators/user.decorator';
import { AuthGuard } from 'src/guards/authguard.service';
import { QrService } from 'src/services/qr.service';
import { Hub } from '../dal/entity/hub';
import { JoinUserHub } from '../dal/entity/joinUserHub';
import { User } from '../dal/entity/user';
import { Float, Int } from 'type-graphql';
import { FileService } from 'src/services/file.service';

@Resolver()
export class HubResolver {
  constructor(private qrService: QrService, private fileService: FileService) {}

  //@Authorized()
  @UseGuards(AuthGuard)
  @Mutation(() => Hub)
  public async createHub(
    @UserId() userId,
    @Args({ name: 'name', type: () => String }) name: string,
    @Args({ name: 'image', type: () => String }) image: string,
    @Args({ name: 'latitude', type: () => Float }) latitude: number,
    @Args({ name: 'longitude', type: () => Float }) longitude: number,
  ): Promise<Hub> {
    const imageUrl = await this.fileService.storePublicImageFromBase64(image);

    // Creates hub with user as owner.
    const hub = Hub.create({
      latitude,
      longitude,
      name,
      image: imageUrl,
    });
    const result = await hub.save();
    let joinUserHub = await JoinUserHub.create({
      userId: userId,
      hubId: hub.id,
      isOwner: true,
    });
    joinUserHub = await joinUserHub.save();
    return hub;
  }

  //@Authorized()
  @UseGuards(AuthGuard)
  @Query(() => Hub)
  public async hub(
    @UserId() userId,
    @Args({ name: 'id', type: () => Int }) id: number,
  ): Promise<Hub> {
    //FIXME: Need to add check that user is either a member or owner.

    const userHubRelationship = await JoinUserHub.findOne({
      where: {
        hubId: id,
        userId: userId,
      },
      relations: ['hub'],
    });
    userHubRelationship.hub.starred = userHubRelationship.starred;
    return userHubRelationship.hub;
  }

  //@Authorized()
  @UseGuards(AuthGuard)
  @Query(() => [Hub])
  public async ownedHubs(@UserId() userId): Promise<Hub[]> {
    const user = await User.findOne({ id: userId });
    const ownedHubs = await user.ownedHubs();
    return ownedHubs;
  }

  //@Authorized()
  @UseGuards(AuthGuard)
  @Query(() => [Hub])
  public async memberOfHubs(@UserId() userId): Promise<Hub[]> {
    const user = await User.findOne({ id: userId });
    const memberOfHubs = await user.memberOfHubs();
    return memberOfHubs;
  }

  //@Authorized()
  @UseGuards(AuthGuard)
  @Query(() => [Hub])
  public async starredHubs(@UserId() userId) {
    const userHubRelationships = await JoinUserHub.find({
      where: {
        userId: userId,
        starred: true,
      },
      relations: ['hub'],
    });
    const hubs = [];
    for (let index = 0; index < userHubRelationships.length; index++) {
      const element = userHubRelationships[index];
      // element.starred = element.starred;
      element.starred = true;
      hubs.push(element.hub);
    }
    return hubs;
  }

  //@Authorized()
  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  public async deleteHub(
    @Args({ name: 'hubId', type: () => Int }) hubId: number,
  ) {
    const hub = await Hub.findOne({
      where: {
        id: hubId,
      },
      // relations: ["usersConnection"]
    });
    await hub.remove();
    return true;
  }

  //@Authorized()
  @UseGuards(AuthGuard)
  @Mutation(() => Hub)
  public async renameHub(
    @UserId() userId,
    @Args({ name: 'hubId', type: () => Int }) hubId: number,
    @Args({ name: 'newName', type: () => String }) newName: string,
  ): Promise<Hub> {
    //FIXME: Finish implementing check that user is hub owner.

    const joinUserHubResult = await JoinUserHub.findOne({
      where: {
        userId: userId,
        hubId,
        isOwner: true,
      },
      relations: ['hub'],
    });

    let hub = joinUserHubResult.hub;
    hub.name = newName;
    hub = await hub.save();
    return hub;
  }

  //@Authorized()
  @UseGuards(AuthGuard)
  @Mutation(() => Hub)
  //FIXME duplicate with updateHubPhoto? Remove one.
  public async changeHubImage(
    @UserId() userId,
    @Args({ name: 'hubId', type: () => Int }) hubId: number,
    @Args({ name: 'newImage', type: () => String }) newImage: string,
  ): Promise<Hub> {
    //FIXME: Finish implementing check that user is hub owner.

    const joinUserHubResult = await JoinUserHub.findOne({
      where: {
        userId: userId,
        hubId,
        isOwner: true,
      },
      relations: ['hub'],
    });

    let hub = joinUserHubResult.hub;

    await this.fileService.deletePublicImageFromUrl(hub.image);
    const imageUrl = await this.fileService.storePublicImageFromBase64(
      newImage,
    );

    hub.image = imageUrl;
    hub = await hub.save();
    return hub;
  }

  //@Authorized()
  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  public async joinHub(
    @UserId() userId,
    @Args({ name: 'id', type: () => Int }) id: number,
  ) {
    //FIXME: Finish implementing check that user is hub owner.

    let joinUserHub = await JoinUserHub.create({
      userId: userId,
      hubId: id,
      isOwner: true,
    });
    joinUserHub = await joinUserHub.save();

    return true;
  }

  //@Authorized()
  @UseGuards(AuthGuard)
  @Query(() => Hub)
  public async getHubByQRImage(
    @Args({ name: 'qrImageB64', type: () => String }) qrImageB64: string,
  ): Promise<Hub> {
    //FIXME: Finish implementing check that user is hub owner.

    const result = await this.qrService.scanQR(qrImageB64);
    if (result) {
      const id = result.id;
      const hub = await Hub.findOne({ id });
      return hub;
    }
  }

  //@Authorized()
  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  public async setHubStarred(
    @UserId() userId,
    @Args({ name: 'hubId', type: () => Int }) hubId: number,
  ) {
    const hubRelationship = await JoinUserHub.findOne({
      userId: userId,
      hubId: hubId,
    });
    hubRelationship.starred = true;
    await hubRelationship.save();
    return true;
  }

  //@Authorized()
  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  public async setHubNotStarred(
    @UserId() userId,
    @Args({ name: 'hubId', type: () => Int }) hubId: number,
  ) {
    const hubRelationship = await JoinUserHub.findOne({
      userId: userId,
      hubId: hubId,
    });
    hubRelationship.starred = false;
    await hubRelationship.save();
    return true;
  }

  //@Authorized()
  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  public async updateHubPhoto(
    @UserId() userId,
    @Args({ name: 'id', type: () => Int }) id: number,
    @Args({ name: 'image', type: () => String }) image: string,
  ): Promise<boolean> {
    //FIXME make sure that this is only done by the owner of the hub

    let hub = await Hub.findOne({ id });

    await this.fileService.deletePublicImageFromUrl(hub.image);
    const imageUrl = await this.fileService.storePublicImageFromBase64(image);

    hub.image = imageUrl;

    hub = await hub.save();
    return true;
  }
}
