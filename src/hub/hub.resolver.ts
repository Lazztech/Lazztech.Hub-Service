import { Logger, UseGuards } from '@nestjs/common';
import { Args, Float, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlJwtAuthGuard } from '../auth/guards/gql-jwt-auth.guard';
import { Hub } from '../dal/entity/hub.entity';
import { Invite } from '../dal/entity/invite.entity';
import { JoinUserHub } from '../dal/entity/joinUserHub.entity';
import { MicroChat } from '../dal/entity/microChat.entity';
import { User } from '../dal/entity/user.entity';
import { UserId } from '../decorators/user.decorator';
import { UserService } from '../user/user.service';
import { HubActivityService } from './hub-activity/hub-activity.service';
import { HubGeofenceService } from './hub-geofence/hub-geofence.service';
import { HubInviteService } from './hub-invite/hub-invite.service';
import { HubMicroChatService } from './hub-micro-chat/hub-micro-chat.service';
import { HubService } from './hub.service';

@UseGuards(GqlJwtAuthGuard)
@Resolver()
export class HubResolver {
  private logger = new Logger(HubResolver.name);

  constructor(
    private hubService: HubService,
    private hubActivityService: HubActivityService,
    private hubGeofenceService: HubGeofenceService,
    private hubMicroChatService: HubMicroChatService,
    private hubInviteService: HubInviteService,
    private userService: UserService,
  ) {}

  @Mutation(() => JoinUserHub)
  public async createHub(
    @UserId() userId,
    @Args({ name: 'name', type: () => String }) name: string,
    @Args({ name: 'description', type: () => String }) description: string,
    @Args({ name: 'image', type: () => String }) image: string,
    @Args({ name: 'latitude', type: () => Float }) latitude: number,
    @Args({ name: 'longitude', type: () => Float }) longitude: number,
  ): Promise<JoinUserHub> {
    this.logger.log(this.createHub.name);
    const hub = await this.hubService.createHub(userId, {
      name,
      description,
      image,
      latitude,
      longitude,
    } as Hub);
    return hub;
  }

  @Query(() => JoinUserHub)
  public async hub(
    @UserId() userId,
    @Args({ name: 'id', type: () => ID }) id: number,
  ): Promise<JoinUserHub> {
    this.logger.log(this.hub.name);
    const result = await this.hubService.getOneUserHub(userId, id);
    return result;
  }

  @Query(() => [JoinUserHub])
  public async usersHubs(@UserId() userId): Promise<JoinUserHub[]> {
    this.logger.log(this.usersHubs.name);
    const result = await this.hubService.getUserHubs(userId);
    return result;
  }

  @Query(() => [JoinUserHub])
  public async commonUsersHubs(
    @UserId() userId,
    @Args({ name: 'otherUsersId', type: () => ID }) otherUsersId: number,
  ) {
    this.logger.log(this.commonUsersHubs.name);
    const result = await this.hubService.commonUsersHubs(userId, otherUsersId);
    return result;
  }

  @Query(() => [Invite])
  public async invitesByHub(
    @UserId() userId,
    @Args({ name: 'hubId', type: () => ID }) hubId: number,
    @Args({ name: 'includeAccepted', type: () => Boolean, nullable: true })
    includeAccepted = false,
  ): Promise<Invite[]> {
    this.logger.log(this.invitesByHub.name);
    return await this.hubInviteService.getInvitesByHub(
      userId,
      hubId,
      includeAccepted,
    );
  }

  @Query(() => Invite)
  public async invite(
    @UserId() userId,
    @Args({ name: 'hubId', type: () => ID }) hubId: number,
  ): Promise<Invite> {
    this.logger.log(this.invite.name);
    return await this.hubInviteService.getInvite(userId, hubId);
  }

  @Query(() => [Invite])
  public async invitesByUser(
    @UserId() userId,
    @Args({ name: 'includeAccepted', type: () => Boolean, nullable: true })
    includeAccepted = false,
  ): Promise<Invite[]> {
    this.logger.log(this.invitesByUser.name);
    return await this.hubInviteService.getInvitesByUser(
      userId,
      includeAccepted,
    );
  }

  @Mutation(() => Invite)
  public async inviteUserToHub(
    @UserId() userId,
    @Args({ name: 'hubId', type: () => ID }) hubId: number,
    @Args({ name: 'inviteesEmail', type: () => String }) inviteesEmail: string,
  ): Promise<Invite> {
    this.logger.log(this.inviteUserToHub.name);
    const invite: Invite = await this.hubInviteService.inviteUserToHub(
      userId,
      hubId,
      inviteesEmail,
    );
    return invite;
  }

  @Mutation(() => JoinUserHub)
  public async acceptHubInvite(
    @UserId() userId,
    @Args({ name: 'inviteId', type: () => ID }) inviteId: number,
  ): Promise<JoinUserHub> {
    this.logger.log(this.acceptHubInvite.name);
    const result = await this.hubInviteService.acceptHubInvite(
      userId,
      inviteId,
    );
    return result;
  }

  @Mutation(() => Boolean)
  public async deleteInvite(
    @UserId() userId,
    @Args({ name: 'hubId', type: () => ID }) hubId: number,
    @Args({ name: 'inviteId', type: () => ID }) inviteId: number,
  ): Promise<boolean> {
    await this.hubInviteService.deleteInvite(userId, hubId, inviteId);
    return true;
  }

  @Mutation(() => Boolean)
  public async leaveHub(
    @UserId() userId,
    @Args({ name: 'hubId', type: () => ID }) hubId: number,
  ) {
    await this.hubService.leaveHub(userId, hubId);
    return true;
  }

  @Query(() => [User])
  public async usersPeople(@UserId() userId): Promise<User[]> {
    this.logger.log(this.usersPeople.name);
    return this.hubService.usersPeople(userId);
  }

  @Query(() => [Hub])
  public async searchHubByName(
    @UserId() userId,
    @Args({ name: 'search', type: () => String }) search: string,
  ): Promise<Hub[]> {
    this.logger.log(this.searchHubByName.name);
    const results = await this.hubService.searchHubByName(userId, search);
    return results;
  }

  @Query(() => [Hub])
  public async ownedHubs(@UserId() userId): Promise<Hub[]> {
    this.logger.log(this.ownedHubs.name);
    const ownedHubs = await this.userService.getUsersOwnedHubs(userId);
    return ownedHubs;
  }

  @Query(() => [Hub])
  public async memberOfHubs(@UserId() userId): Promise<Hub[]> {
    this.logger.log(this.memberOfHubs.name);
    const memberOfHubs = await this.userService.memberOfHubs(userId);
    return memberOfHubs;
  }

  @Mutation(() => Boolean)
  public async deleteHub(
    @UserId() userId,
    @Args({ name: 'hubId', type: () => ID }) hubId: number,
  ) {
    this.logger.log(this.deleteHub.name);
    await this.hubService.deleteHub(userId, hubId);
    return true;
  }

  @Mutation(() => Hub)
  public async editHub(
    @UserId() userId,
    @Args({ name: 'hubId', type: () => ID }) hubId: number,
    @Args({ name: 'name', type: () => String }) name: string,
    @Args({ name: 'description', type: () => String }) description: string,
  ): Promise<Hub> {
    this.logger.log(this.editHub.name);
    const result = await this.hubService.editHub(
      userId,
      hubId,
      name,
      description,
    );
    return result;
  }

  @Mutation(() => Hub)
  public async changeHubLocation(
    @UserId() userId,
    @Args({ name: 'hubId', type: () => ID }) hubId: number,
    @Args({ name: 'latitude', type: () => Float }) latitude: number,
    @Args({ name: 'longitude', type: () => Float }) longitude: number,
  ) {
    this.logger.log(this.changeHubLocation.name);
    return await this.hubService.changeHubLocation(
      userId,
      hubId,
      latitude,
      longitude,
    );
  }

  @Mutation(() => Hub)
  public async changeHubImage(
    @UserId() userId,
    @Args({ name: 'hubId', type: () => ID }) hubId: number,
    @Args({ name: 'newImage', type: () => String }) newImage: string,
  ): Promise<Hub> {
    this.logger.log(this.changeHubImage.name);
    const result = await this.hubService.changeHubImage(
      userId,
      hubId,
      newImage,
    );
    return result;
  }

  @Mutation(() => Boolean)
  public async setHubStarred(
    @UserId() userId,
    @Args({ name: 'hubId', type: () => ID }) hubId: number,
  ) {
    this.logger.log(this.setHubStarred.name);
    await this.hubService.setHubStarred(userId, hubId);
    return true;
  }

  @Mutation(() => Boolean)
  public async setHubNotStarred(
    @UserId() userId,
    @Args({ name: 'hubId', type: () => ID }) hubId: number,
  ) {
    this.logger.log(this.setHubNotStarred.name);
    await this.setHubNotStarred(userId, hubId);
    return true;
  }

  @Mutation(() => JoinUserHub)
  public async enteredHubGeofence(
    @UserId() userId,
    @Args({ name: 'hubId', type: () => ID }) hubId: number,
  ): Promise<JoinUserHub> {
    this.logger.log(this.enteredHubGeofence.name);
    return await this.hubGeofenceService.enteredHubGeofence(userId, hubId);
  }

  @Mutation(() => JoinUserHub)
  public async dwellHubGeofence(
    @UserId() userId,
    @Args({ name: 'hubId', type: () => ID }) hubId: number,
  ): Promise<JoinUserHub> {
    this.logger.log(this.dwellHubGeofence.name);
    return await this.hubGeofenceService.dwellHubGeofence(userId, hubId);
  }

  @Mutation(() => JoinUserHub)
  public async exitedHubGeofence(
    @UserId() userId,
    @Args({ name: 'hubId', type: () => ID }) hubId: number,
  ): Promise<JoinUserHub> {
    this.logger.log(this.exitedHubGeofence.name);
    return await this.hubGeofenceService.exitedHubGeofence(userId, hubId);
  }

  @Mutation(() => Hub)
  public async activateHub(
    @UserId() userId,
    @Args({ name: 'hubId', type: () => ID }) hubId: number,
  ) {
    this.logger.log(this.activateHub.name);
    const result = await this.hubActivityService.activateHub(userId, hubId);
    return result;
  }

  @Mutation(() => Hub)
  public async deactivateHub(
    @UserId() userId,
    @Args({ name: 'hubId', type: () => ID }) hubId: number,
  ) {
    this.logger.log(this.deactivateHub.name);
    const result = await this.hubActivityService.deactivateHub(userId, hubId);
    return result;
  }

  @Mutation(() => Boolean)
  public async microChatToHub(
    @UserId() userId,
    @Args({ name: 'hubId', type: () => ID }) hubId: number,
    @Args({ name: 'microChatId', type: () => ID }) microChatId: number,
  ) {
    this.logger.log(this.microChatToHub.name);
    await this.hubMicroChatService.microChatToHub(userId, hubId, microChatId);
    return true;
  }

  @Mutation(() => MicroChat)
  public async createMicroChat(
    @UserId() userId,
    @Args({ name: 'hubId', type: () => ID }) hubId: number,
    @Args({ name: 'microChatText', type: () => String }) microChatText: string,
  ) {
    this.logger.log(this.createMicroChat.name);
    const microChat = await this.hubMicroChatService.createMicroChat(
      userId,
      hubId,
      microChatText,
    );
    return microChat;
  }

  @Mutation(() => Boolean)
  public async deleteMicroChat(
    @UserId() userId,
    @Args({ name: 'hubId', type: () => ID }) hubId: number,
    @Args({ name: 'microChatId', type: () => ID }) microChatId: number,
  ) {
    this.logger.log(this.deleteMicroChat.name);
    await this.hubMicroChatService.deleteMicroChat(userId, hubId, microChatId);
    return true;
  }

}
