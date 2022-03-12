import { Inject, Injectable, Logger } from '@nestjs/common';
import { Hub } from '../dal/entity/hub.entity';
import { JoinUserHub } from '../dal/entity/joinUserHub.entity';
import { User } from '../dal/entity/user.entity';
import { FileServiceInterface } from 'src/file/interfaces/file-service.interface';
import { EditUserDetails } from './dto/editUserDetails.input';
import { FILE_SERVICE } from '../file/file-service.token';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/core';

@Injectable()
export class UserService {
  private logger = new Logger(UserService.name);

  constructor(
    @Inject(FILE_SERVICE)
    private readonly fileService: FileServiceInterface,
    @InjectRepository(JoinUserHub)
    private joinUserHubRepository: EntityRepository<JoinUserHub>,
    @InjectRepository(User)
    private userRepository: EntityRepository<User>,
  ) {
    this.logger.log('constructor');
  }

  public async findOne(email: string) {
    return await this.userRepository.findOne({ email });
  }

  public async getUser(userId: any) {
    this.logger.log(this.getUser.name);
    return await this.userRepository.findOne({ id: userId });
  }

  public async getUsersOwnedHubs(userId: number): Promise<Hub[]> {
    this.logger.log(this.getUsersOwnedHubs.name);

    const joinUserHubResults = await this.joinUserHubRepository.find({
      user: userId,
      isOwner: true,
    });
    const hubs: Hub[] = await Promise.all(
      joinUserHubResults.map((result) => result.hub.load()),
    );
    return hubs;
  }

  public async memberOfHubs(userId: number): Promise<Hub[]> {
    this.logger.log(this.memberOfHubs.name);

    const joinUserHubResults = await this.joinUserHubRepository.find({
      user: userId,
      isOwner: false,
    });
    const hubs: Hub[] = await Promise.all(
      joinUserHubResults.map((result) => result.hub.load()),
    );
    return hubs;
  }

  public async editUserDetails(userId: any, details: EditUserDetails) {
    this.logger.log(this.editUserDetails.name);
    const user = await this.userRepository.findOne({ id: userId });
    user.firstName = details.firstName;
    user.lastName = details.lastName;
    user.description = details.description;
    await this.userRepository.persistAndFlush(user);
    return user;
  }

  public async changeEmail(userId: any, newEmail: string) {
    this.logger.log(this.changeEmail.name);
    const user = await this.userRepository.findOne({ id: userId });
    user.email = newEmail;
    await this.userRepository.persistAndFlush(user);
    return user;
  }

  public async changeUserImage(userId: any, newImage: string) {
    this.logger.log(this.changeUserImage.name);
    const user = await this.userRepository.findOne(userId);
    if (user.image) {
      await this.fileService.delete(user.image);
    }
    const imageUrl = await this.fileService.storeImageFromBase64(newImage);
    user.image = imageUrl;
    await this.userRepository.persistAndFlush(user);
    return user;
  }

  public async updateLastOnline(user: User) {
    this.logger.log(this.updateLastOnline.name);
    user.lastOnline = Date.now().toString();
    await this.userRepository.persistAndFlush(user);
  }

  public async blockUser(fromUserId: any, toUserId: any) {

  }

  public async unblockUser(fromUserId: any, toUserId: any) {
    
  }
}
