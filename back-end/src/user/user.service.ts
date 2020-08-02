import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Hub } from 'src/dal/entity/hub.entity';
import { JoinUserHub } from 'src/dal/entity/joinUserHub.entity';
import { User } from 'src/dal/entity/user.entity';
import { FileService } from 'src/services/file/file.service';
import { Repository } from 'typeorm';
import { EditUserDetails } from './dto/editUserDetails.input';

@Injectable()
export class UserService {
  private logger = new Logger(UserService.name);

  constructor(
    private fileService: FileService,
    @InjectRepository(JoinUserHub)
    private joinUserHubRepository: Repository<JoinUserHub>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {
    this.logger.log('constructor');
  }

  public async getUser(userId: any) {
    this.logger.log(this.getUser.name);
    return await this.userRepository.findOne({ where: { id: userId } });
  }

  public async getUsersOwnedHubs(userId: number): Promise<Hub[]> {
    this.logger.log(this.getUsersOwnedHubs.name);

    const joinUserHubResults = await this.joinUserHubRepository.find({
      where: {
        userId,
        isOwner: true,
      },
      relations: ['hub'],
    });
    const hubs: Hub[] = joinUserHubResults.map(result => result.hub);
    return hubs;
  }

  public async memberOfHubs(userId: number): Promise<Hub[]> {
    this.logger.log(this.memberOfHubs.name);

    const joinUserHubResults = await this.joinUserHubRepository.find({
      where: {
        userId,
        isOwner: false,
      },
      relations: ['hub'],
    });
    const hubs: Hub[] = joinUserHubResults.map(result => result.hub);
    return hubs;
  }

  public async editUserDetails(userId: any, details: EditUserDetails) {
    this.logger.log(this.editUserDetails.name);
    let user = await this.userRepository.findOne({ where: { id: userId } });
    user.firstName = details.firstName;
    user.lastName = details.lastName;
    user.description = details.description;
    user = await this.userRepository.save(user);
    return user;
  }

  public async changeEmail(userId: any, newEmail: string) {
    this.logger.log(this.changeEmail.name);
    const user = await this.userRepository.findOne({ where: { id: userId } });
    user.email = newEmail;
    await this.userRepository.save(user);
    return user;
  }

  public async changeUserImage(userId: any, newImage: string) {
    this.logger.log(this.changeUserImage.name);
    let user = await this.userRepository.findOne(userId);
    if (user.image) {
      await this.fileService.deletePublicImageFromUrl(user.image);
    }
    const imageUrl = await this.fileService.storePublicImageFromBase64(
      newImage,
    );
    user.image = imageUrl;
    user = await this.userRepository.save(user);
    return user;
  }
}
