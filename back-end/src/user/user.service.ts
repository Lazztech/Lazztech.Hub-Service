import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Hub } from 'src/dal/entity/hub.entity';
import { JoinUserHub } from 'src/dal/entity/joinUserHub.entity';
import { Repository } from 'typeorm';
import { User } from 'src/dal/entity/user.entity';
import { FileService } from 'src/services/file.service';
import { EmailService } from 'src/services/email.service';
import { Invite } from 'src/dal/entity/invite.entity';
import { EditUserDetails } from './dto/editUserDetails.input';
import { ChangeEmail } from './dto/changeEmail.input';
import { ChangeUserImage } from './dto/changeUserImage.input';

@Injectable()
export class UserService {
  private logger = new Logger(UserService.name);

  constructor(
    private fileService: FileService,
    private emailService: EmailService,
    @InjectRepository(JoinUserHub)
    private joinUserHubRepository: Repository<JoinUserHub>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Invite)
    private inviteRepository: Repository<Invite>,
  ) {
    this.logger.log('constructor');
  }

  public async getUser(userId: any) {
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

  public async editUserDetails(details: EditUserDetails) {
    const user = await this.userRepository.findOne({ where: { id: details.userId } });
    user.firstName = details.firstName;
    user.lastName = details.lastName;
    user.description = details.description;
    await this.userRepository.save(user);
    return user;
  }

  public async changeEmail(details: ChangeEmail) {
    const user = await this.userRepository.findOne({ where: { id: details.userId } });
    user.email = details.newEmail;
    await this.userRepository.save(user);
    return user;
  }

  public async newInvite(email: string) {
    let invite = this.inviteRepository.create({
      email,
    });
    invite = await this.inviteRepository.save(invite);

    await this.emailService.sendInviteEmail(email);
  }

  public async changeUserImage(details: ChangeUserImage) {
    let user = await this.userRepository.findOne(details.userId);
    if (user.image) {
      await this.fileService.deletePublicImageFromUrl(user.image);
    }
    const imageUrl = await this.fileService.storePublicImageFromBase64(details.newImage);
    user.image = imageUrl;
    user = await this.userRepository.save(user);
    return user;
  }

}
