import { Inject, Injectable, Logger } from '@nestjs/common';
import { Hub } from '../dal/entity/hub.entity';
import { JoinUserHub } from '../dal/entity/joinUserHub.entity';
import { User } from '../dal/entity/user.entity';
import { FileServiceInterface } from 'src/file/interfaces/file-service.interface';
import { EditUserDetails } from './dto/editUserDetails.input';
import { FILE_SERVICE } from '../file/file-service.token';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/core';
import { Block } from '../dal/entity/block.entity';
import { FileUpload } from 'src/file/interfaces/file-upload.interface';
import { File } from '../dal/entity/file.entity';
import { JoinEventFile } from 'src/dal/entity/joinEventFile.entity';
import { JoinHubFile } from 'src/dal/entity/joinHubFile.entity';

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
    @InjectRepository(Block)
    private blockRepository: EntityRepository<Block>,
    @InjectRepository(File)
    private fileRepository: EntityRepository<File>,
    @InjectRepository(JoinEventFile)
    private joinEventFileRepository: EntityRepository<JoinEventFile>,
    @InjectRepository(JoinHubFile)
    private joinHubFileRepository: EntityRepository<JoinHubFile>,
  ) {
    this.logger.debug('constructor');
  }

  public async findOne(email: string) {
    return await this.userRepository.findOne({ email });
  }

  public async getUser(userId: any) {
    this.logger.debug(this.getUser.name);
    return await this.userRepository.findOne({ id: userId });
  }

  public async getFileUploads(userId: any) {
    this.logger.debug(this.getFileUploads.name);
    const a = await this.joinEventFileRepository.find({
      file: { createdBy: userId },
    });
    const b = await this.joinHubFileRepository.find({
      file: { createdBy: userId }
    });
    return [...a, ...b];
  }

  public async getUsersOwnedHubs(userId: number): Promise<Hub[]> {
    this.logger.debug(this.getUsersOwnedHubs.name);

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
    this.logger.debug(this.memberOfHubs.name);

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
    this.logger.debug(this.editUserDetails.name);
    const user = await this.userRepository.findOne({ id: userId });
    user.firstName = details.firstName;
    user.lastName = details.lastName;
    user.description = details.description;
    await this.userRepository.persistAndFlush(user);
    return user;
  }

  public async updateUser(userId: any, value: User, image: Promise<FileUpload>): Promise<User> {
    let user = await this.userRepository.findOneOrFail({ id: userId }, {
      populate: ['profileImage']
    }) as User;

    if (image) {
      if (user.profileImage) {
        await this.fileService.delete((await user.profileImage.load()).fileName);
      }
      const imageFile = await this.fileService.storeImageFromFileUpload(image, userId);
      user.profileImage = imageFile as any;
    }

    user = this.userRepository.assign(user, value);
    await this.userRepository.persistAndFlush(user);
    return user;
  }

  public async changeEmail(userId: any, newEmail: string) {
    this.logger.debug(this.changeEmail.name);
    const user = await this.userRepository.findOne({ id: userId });
    user.email = newEmail;
    await this.userRepository.persistAndFlush(user);
    return user;
  }

  public async updateLastOnline(user: User) {
    this.logger.debug(this.updateLastOnline.name);
    user.lastOnline = Date.now().toString();
    await this.userRepository.persistAndFlush(user);
  }

  public async blockUser(fromUserId: any, toUserId: any) {
    const block = this.blockRepository.create({
      from: fromUserId,
      to: toUserId
    });
    await this.blockRepository.persistAndFlush(block);
    return block;
  }

  public async unblockUser(fromUserId: any, toUserId: any) {
    const block = await this.blockRepository.findOneOrFail({
      from: fromUserId,
      to: toUserId
    });
    await this.blockRepository.removeAndFlush(block);
    return block;
  }
}
