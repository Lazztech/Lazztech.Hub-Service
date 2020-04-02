import { Injectable, Logger } from '@nestjs/common';
import { Hub } from 'src/dal/entity/hub.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { JoinUserHub } from 'src/dal/entity/joinUserHub.entity';
import { Repository } from 'typeorm';
import { sign } from 'jsonwebtoken';
import { User } from 'src/dal/entity/user.entity';
import * as bcrypt from 'bcryptjs';
import { ConfigService } from '@nestjs/config';
import { InAppNotification } from 'src/dal/entity/inAppNotification.entity';
import { JoinUserInAppNotifications } from 'src/dal/entity/joinUserInAppNotifications.entity';

@Injectable()
export class UserService {
  private logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(JoinUserHub)
    private joinUserHubRepository: Repository<JoinUserHub>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(InAppNotification)
    private inAppNotificationRepository: Repository<InAppNotification>,
    @InjectRepository(JoinUserInAppNotifications)
    private joinUserInAppNotificationRepository: Repository<JoinUserInAppNotifications>,
    private readonly configService: ConfigService,
  ) {
    this.logger.log('constructor');
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

  public async login(password: string, email: string) {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      this.logger.warn(`User not found by email address for user.id: ${user.id}`);
      //FIXME throw error instead of returning null
      return null;
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      this.logger.warn(`Password not valid for user.id: ${user.id}.`);
      //FIXME throw error instead of returning null
      return null;
    }

    const tokenSecret = this.configService.get<string>('ACCESS_TOKEN_SECRET');
    const accessToken = sign({ userId: user.id }, tokenSecret);

    return accessToken;
  }

  async register(firstName: string, lastName: string, email: string, password: string) {
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      this.logger.log(`User already exists with email address: ${email}`);
      return null;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    //TODO THIS SECTION SHOULD BE AN ACID TRANSACTION
    let user = await this.userRepository.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });
    user = await this.userRepository.save(user);

    await this.addInitialInAppNotification(user);

    const tokenSecret = this.configService.get<string>('ACCESS_TOKEN_SECRET');
    const accessToken = sign({ userId: user.id }, tokenSecret);
    return accessToken;
  }

  private async addInitialInAppNotification(user: User) {
    const inAppNotification = this.inAppNotificationRepository.create({
      text: `You'll find your notifications here.
            You can pull down to refresh and check for more.`,
      date: Date.now().toString(),
    });
    await this.inAppNotificationRepository.save(inAppNotification);
    const joinUserInAppNotification = this.joinUserInAppNotificationRepository.create({
      userId: user.id,
      inAppNotificationId: inAppNotification.id,
    });
    await this.joinUserInAppNotificationRepository.save(joinUserInAppNotification);
  }
}
