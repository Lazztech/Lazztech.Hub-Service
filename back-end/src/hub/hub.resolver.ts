import { UseGuards, Logger } from '@nestjs/common';
import { Mutation, Query, Resolver, Args } from '@nestjs/graphql';
import { UserId } from 'src/decorators/user.decorator';
import { AuthGuard } from 'src/guards/authguard.service';
import { QrService } from 'src/services/qr.service';
import { Hub } from '../dal/entity/hub.entity';
import { JoinUserHub } from '../dal/entity/joinUserHub.entity';
import { User } from '../dal/entity/user.entity';
import { Float, Int } from 'type-graphql';
import { FileService } from 'src/services/file.service';
import { HubService } from './hub.service';
import { MicroChat } from 'src/dal/entity/microChat.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/user/user.service';

@Resolver()
export class HubResolver {
  private logger = new Logger(HubResolver.name, true);

  constructor(
    private hubService: HubService,
    private userService: UserService,
    @InjectRepository(Hub)
    private hubRepository: Repository<Hub>,
    @InjectRepository(JoinUserHub)
    private joinUserHubRepository: Repository<JoinUserHub>,
    @InjectRepository(MicroChat)
    private microChatRepository: Repository<MicroChat>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  @UseGuards(AuthGuard)
  @Mutation(() => Hub)
  public async createHub(
    @UserId() userId,
    @Args({ name: 'name', type: () => String }) name: string,
    @Args({ name: 'description', type: () => String }) description: string,
    @Args({ name: 'image', type: () => String }) image: string,
    @Args({ name: 'latitude', type: () => Float }) latitude: number,
    @Args({ name: 'longitude', type: () => Float }) longitude: number,
  ): Promise<Hub> {
    this.logger.log(this.createHub.name);
    const hub = await this.hubService.createHub(userId, name, description, image, latitude, longitude);
    return hub;
  }

  @UseGuards(AuthGuard)
  @Query(() => JoinUserHub)
  public async hub(
    @UserId() userId,
    @Args({ name: 'id', type: () => Int }) id: number,
  ): Promise<JoinUserHub> {
    this.logger.log(this.hub.name);
    const result = await this.hubService.getOneUserHub(userId, id);
    return result;
  }

  @UseGuards(AuthGuard)
  @Query(() => [JoinUserHub])
  public async usersHubs(@UserId() userId): Promise<JoinUserHub[]> {
    this.logger.log(this.usersHubs.name);
    const result = await this.hubService.getUserHubs(userId);
    return result;
  }

  @UseGuards(AuthGuard)
  @Query(() => [JoinUserHub])
  public async commonUsersHubs(
    @UserId() userId,
    @Args({ name: 'otherUsersId', type: () => Int }) otherUsersId: number,
  ) {
    this.logger.log(this.commonUsersHubs.name);
    const result = await this.hubService.commonUsersHubs(userId, otherUsersId)
    return result;
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  public async inviteUserToHub(
    @UserId() userId,
    @Args({ name: 'hubId', type: () => Int }) hubId: number,
    @Args({ name: 'inviteesEmail', type: () => String }) inviteesEmail: string,
  ): Promise<boolean> {
    this.logger.log(this.inviteUserToHub.name);
    await this.hubService.inviteUserToHub(userId, hubId, inviteesEmail);
    return true;
  }

  @UseGuards(AuthGuard)
  @Query(() => [User])
  public async usersPeople(@UserId() userId): Promise<User[]> {
    this.logger.log(this.usersPeople.name);
    const result = await this.hubService.usersPeople(userId);
    return result;
  }

  @UseGuards(AuthGuard)
  @Query(() => [Hub])
  public async searchHubByName(
    @UserId() userId,
    @Args({ name: 'search', type: () => String }) search: string,
  ): Promise<Hub[]> {
    this.logger.log(this.searchHubByName.name);

    const userHubRelationship = await this.joinUserHubRepository.find({
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

  @UseGuards(AuthGuard)
  @Query(() => [Hub])
  public async ownedHubs(@UserId() userId): Promise<Hub[]> {
    this.logger.log(this.ownedHubs.name);
    const ownedHubs = await this.userService.getUsersOwnedHubs(userId);
    return ownedHubs;
  }

  @UseGuards(AuthGuard)
  @Query(() => [Hub])
  public async memberOfHubs(@UserId() userId): Promise<Hub[]> {
    this.logger.log(this.memberOfHubs.name);
    const memberOfHubs = await this.userService.memberOfHubs(userId);
    return memberOfHubs;
  }

  @UseGuards(AuthGuard)
  @Query(() => [Hub])
  public async starredHubs(@UserId() userId) {
    this.logger.log(this.starredHubs.name);
    const result = await this.hubService.getStarredHubs(userId);
    return result;
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  public async deleteHub(
    @UserId() userId,
    @Args({ name: 'hubId', type: () => Int }) hubId: number,
  ) {
    this.logger.log(this.deleteHub.name);
    await this.hubService.deleteHub(userId, hubId);
    return true;
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Hub)
  public async editHub(
    @UserId() userId,
    @Args({ name: 'hubId', type: () => Int }) hubId: number,
    @Args({ name: 'name', type: () => String }) name: string,
    @Args({ name: 'description', type: () => String }) description: string,
  ): Promise<Hub> {
    this.logger.log(this.editHub.name);
    const result = await this.hubService.editHub(userId, hubId, name, description);
    return result;
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Hub)
  public async changeHubImage(
    @UserId() userId,
    @Args({ name: 'hubId', type: () => Int }) hubId: number,
    @Args({ name: 'newImage', type: () => String }) newImage: string,
  ): Promise<Hub> {
    this.logger.log(this.changeHubImage.name);
    const result = await this.hubService.changeHubImage(userId, hubId, newImage);
    return result;
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  public async joinHub(
    @UserId() userId,
    @Args({ name: 'id', type: () => Int }) id: number,
  ): Promise<boolean> {
    this.logger.log(this.joinHub.name);
    await this.hubService.joinHub(userId, id);
    return true;
  }

  @UseGuards(AuthGuard)
  @Query(() => Hub)
  public async getHubByQRImage(
    @Args({ name: 'qrImageB64', type: () => String }) qrImageB64: string,
  ): Promise<Hub> {
    this.logger.log(this.getHubByQRImage.name);
    const result = await this.hubService.getHubByQRImage(qrImageB64);
    return;
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  public async setHubStarred(
    @UserId() userId,
    @Args({ name: 'hubId', type: () => Int }) hubId: number,
  ) {
    this.logger.log(this.setHubStarred.name);
    await this.hubService.setHubStarred(userId, hubId);
    return true;
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  public async setHubNotStarred(
    @UserId() userId,
    @Args({ name: 'hubId', type: () => Int }) hubId: number,
  ) {
    this.logger.log(this.setHubNotStarred.name);
    await this.setHubNotStarred(userId, hubId);
    return true;
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  public async enteredHubGeofence(
    @UserId() userId,
    @Args({ name: 'hubId', type: () => Int }) hubId: number,
  ): Promise<boolean> {
    this.logger.log(this.enteredHubGeofence.name);
    await this.hubService.enteredHubGeofence(userId, hubId);
    return true;
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  public async exitedHubGeofence(
    @UserId() userId,
    @Args({ name: 'hubId', type: () => Int }) hubId: number,
  ): Promise<boolean> {
    this.logger.log(this.exitedHubGeofence.name);
    await this.hubService.exitedHubGeofence(userId, hubId);
    return true;
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Hub)
  public async activateHub(
    @UserId() userId,
    @Args({ name: 'hubId', type: () => Int }) hubId: number,
  ) {
    this.logger.log(this.activateHub.name);
    const result = await this.hubService.activateHub(userId, hubId);
    return result;
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Hub)
  public async deactivateHub(
    @UserId() userId,
    @Args({ name: 'hubId', type: () => Int }) hubId: number,
  ) {
    this.logger.log(this.deactivateHub.name);
    const result = await this.hubService.deactivateHub(userId, hubId);
    return result;
  }

  @UseGuards(AuthGuard)
  @Mutation(() => MicroChat)
  public async microChatToHub(
    @UserId() userId,
    @Args({ name: 'hubId', type: () => Int }) hubId: number,
    @Args({ name: 'microChatId', type: () => Int }) microChatId: number,
  ) {
    this.logger.log(this.microChatToHub.name);

    const user = await this.userRepository.findOne(userId);
    const hub = await this.hubRepository.findOne({
      where: {
        id: hubId,
      },
      relations: ['usersConnection', 'usersConnection.user', 'microChats'],
    });
    const microChat = hub.microChats.find(x => x.id === microChatId);
    await this.hubService.microChatToHub(user, hub, microChat);
    return microChat;
  }

  @UseGuards(AuthGuard)
  @Mutation(() => MicroChat)
  public async createMicroChat(
    @UserId() userId,
    @Args({ name: 'hubId', type: () => Int }) hubId: number,
    @Args({ name: 'microChatText', type: () => String }) microChatText: string,
  ) {
    this.logger.log(this.createMicroChat.name);

    const usersConnection = await this.joinUserHubRepository.findOne({
      where: {
        userId,
        hubId,
      },
      relations: ['user', 'hub', 'hub.microChats'],
    });

    if (!usersConnection) {
      this.logger.error(
        'No valid relationship found between user and hub for that action.',
      );
    }

    let microChat = new MicroChat();
    microChat.hubId = hubId;
    microChat.text = microChatText;
    microChat = await this.microChatRepository.save(microChat);

    this.logger.log(
      `createMicroChat(userId: ${userId}, hubId: ${hubId}, microChatText: ${microChatText}) completed successfully.`,
    );

    return microChat;
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  public async deleteMicroChat(
    @UserId() userId,
    @Args({ name: 'hubId', type: () => Int }) hubId: number,
    @Args({ name: 'microChatId', type: () => Int }) microChatId: number,
  ) {
    this.logger.log(this.deleteMicroChat.name);

    const usersConnection = await this.joinUserHubRepository.findOne({
      where: {
        userId,
        hubId,
      },
      relations: ['user', 'hub', 'hub.microChats'],
    });

    if (!usersConnection) {
      this.logger.error(
        'No valid relationship found between user and hub for that action.',
      );
    }

    const microChat = usersConnection.hub.microChats.find(
      x => x.id == microChatId,
    );
    await this.microChatRepository.remove(microChat);

    this.logger.log(
      `deleteMicroChat(userId: ${userId}, hubId: ${hubId}, microChatId ${microChatId}) completed successfully.`,
    );

    return true;
  }
}
