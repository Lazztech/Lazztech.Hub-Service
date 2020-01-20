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

  @UseGuards(AuthGuard)
  @Query(() => JoinUserHub)
  public async hub(
    @UserId() userId,
    @Args({ name: 'id', type: () => Int }) id: number,
  ): Promise<JoinUserHub> {
    const userHubRelationship = await JoinUserHub.findOne({
      where: {
        hubId: id,
        userId: userId,
      },
      relations: [
        'hub',
        'hub.usersConnection',
        'hub.usersConnection.user'
      ],
    });
    return userHubRelationship;
  }

  @UseGuards(AuthGuard)
  @Query(() => [JoinUserHub])
  public async usersHubs(
    @UserId() userId
  ): Promise<JoinUserHub[]> {
    const userHubRelationships = await JoinUserHub.find({
      where: {
        userId: userId,
      },
      relations: [
        'hub',
        'hub.usersConnection',
      ],
    });
    return userHubRelationships;
  }

  @UseGuards(AuthGuard)
  @Query(() => [JoinUserHub])
  public async commonUsersHubs(
    @UserId() userId,
    @Args({ name: 'otherUsersId', type: () => Int }) otherUsersId: number,
  ) {
    const userHubRelationships = await JoinUserHub.find({
      where: {
        userId: userId,
      },
      relations: [
        'hub',
        'hub.usersConnection',
        'hub.usersConnection.hub',
        'hub.usersConnection.hub.usersConnection',
      ],
    });

    let commonHubRelationships = [];

    for (let index = 0; index < userHubRelationships.length; index++) {
      const element = userHubRelationships[index];
      if (element.hub.usersConnection.find(x => x.userId == otherUsersId)) {
        commonHubRelationships.push(element.hub.usersConnection.find(x => x.userId == otherUsersId))
      }
    }

    return commonHubRelationships;
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  public async inviteUserToHub(
    @UserId() userId,
    @Args({ name: 'hubId', type: () => Int }) hubId: number,
    @Args({ name: 'inviteesEmail', type: () => String }) inviteesEmail: string
  ): Promise<boolean> {
    const userHubRelationships = await JoinUserHub.findOne({
      where: {
        userId: userId,
        hubId: hubId,
        isOwner: true,
      },
      relations: ['hub'],
    });
    const invitee = await User.findOne({
      where: {
        email: inviteesEmail
      }
    });
    if (!invitee) {
      //TODO safe to db table of invites as unfulfilled.
      // send email
      // check for pending invites when the user creates
      // and account with that email.
    }

    let newRelationship = JoinUserHub.create({
      userId: invitee.id,
      hubId,
      isOwner: false
    });
    newRelationship = await newRelationship.save();
    
    return true;
  }

  @UseGuards(AuthGuard)
  @Query(() => [User])
  public async usersPeople(
    @UserId() userId
  ): Promise<User[]> {
    //TODO optimize this
    const userHubRelationships = await JoinUserHub.find({
      where: {
        userId: userId,
      },
    });

    const usersHubIds: Array<number> = [];
    for (let index = 0; index < userHubRelationships.length; index++) {
      const element = userHubRelationships[index];
      usersHubIds.push(element.hubId);
    }

    let usersPeople: Array<User> = [];
    for (let index = 0; index < usersHubIds.length; index++) {
      const usersHubId = usersHubIds[index];
      const userHubRelationships = await JoinUserHub.find({
        where: {
          hubId: usersHubId,
        },
        relations: ['user'],
      });

      for (let index = 0; index < userHubRelationships.length; index++) {
        const otherUserId = userHubRelationships[index].userId;

        const user = userHubRelationships[index].user;
        if (usersPeople.find(x => x.id == otherUserId) == undefined) {
          usersPeople.push(user);
        }
      }
    }

    return usersPeople;
  }

  @UseGuards(AuthGuard)
  @Query(() => [Hub])
  public async searchHubByName(
    @UserId() userId,
    @Args({ name: 'search', type: () => String}) search: string
  ): Promise<Hub[]> {
    const userHubRelationship = await JoinUserHub.find({
      where: {
        userId: userId,
      },
      relations: ['hub'],
    });
    search = search.toLowerCase();
    let results: Hub[] = [];
    for (let index = 0; index < userHubRelationship.length; index++) {
      const element = userHubRelationship[index];
      if (element.hub.name.toLowerCase().includes(search)) {
        results.push(element.hub);
      }
    }

    return results;
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
  ): Promise<boolean> {
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

  @UseGuards(AuthGuard)
  @Mutation(() =>Boolean)
  public async enteredHubGeofence(
    @UserId() userId,
    @Args({name: 'hubId', type: () => Int}) hubId: number
  ): Promise<boolean> {

    let hubRelationship = await JoinUserHub.findOne({
      userId,
      hubId
    });

    if(!hubRelationship)
      throw Error(`no corresponding hub relationship found for userId: ${userId} & hubId: ${hubId}`)

    hubRelationship.isPresent = true;
    hubRelationship = await hubRelationship.save();

    return true;
  }

  @UseGuards(AuthGuard)
  @Mutation(() =>Boolean)
  public async exitedHubGeofence(
    @UserId() userId,
    @Args({name: 'hubId', type: () => Int}) hubId: number
  ): Promise<boolean> {

    let hubRelationship = await JoinUserHub.findOne({
      userId,
      hubId
    });

    if(!hubRelationship)
      throw Error(`no corresponding hub relationship found for userId: ${userId} & hubId: ${hubId}`)

    hubRelationship.isPresent = false;
    hubRelationship = await hubRelationship.save();

    return true;
  }
}
