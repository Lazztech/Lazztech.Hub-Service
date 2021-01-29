import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../dal/entity/user.entity';
import { Repository } from 'typeorm';
import { ChangePassword } from './dto/changePassword.input';
import { NotificationService } from '../notification/notification.service';
import { InAppNotificationDto } from '../notification/dto/inAppNotification.dto';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { Payload } from './dto/payload.dto';

@Injectable()
export class AuthService {
  private logger = new Logger(AuthService.name);

  constructor(
    private readonly configService: ConfigService,
    private notificationService: NotificationService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async register(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
  ) {
    this.logger.log(this.register.name);
    const existingUser = await this.userService.findOne(email);
    if (existingUser) {
      this.logger.log(`User already exists with email address: ${email}`);
      return null;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    // TODO THIS SECTION SHOULD BE AN ACID TRANSACTION
    let user = await this.userRepository.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });
    user = await this.userRepository.save(user);

    await this.notificationService.addInAppNotificationForUser(user.id, {
      text: `You'll find your notifications here.
            You can pull down to refresh and check for more.`,
      date: Date.now().toString(),
    } as InAppNotificationDto);

    return this.jwtService.sign({ userId: user.id } as Payload);
  }

  public async login(password: string, email: string) {
    this.logger.log(this.login.name);
    const user = await this.userService.findOne(email);

    if (!user) {
      this.logger.warn(
        `User not found by email address for user.id: ${user.id}`,
      );
      // FIXME throw error instead of returning null
      return null;
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      this.logger.warn(`Password not valid for user.id: ${user.id}.`);
      // FIXME throw error instead of returning null
      return null;
    }

    return this.jwtService.sign({ userId: user.id } as Payload);
  }

  public async changePassword(userId: any, details: ChangePassword) {
    this.logger.log(this.changePassword.name);
    const user = await this.userRepository.findOne({ where: { id: userId } });
    // TODO Should it invalidate/blacklist the jwt?
    const valid = await bcrypt.compare(details.oldPassword, user.password);

    if (valid) {
      const newHashedPassword = await bcrypt.hash(details.newPassword, 12);
      user.password = newHashedPassword;
      await this.userRepository.save(user);

      return true;
    } else {
      return false;
    }
  }

  public async deleteAccount(userId: number, email: string, password: string) {
    this.logger.log(this.deleteAccount.name);
    const user = await this.userRepository.findOne({ where: { id: userId } });

    const valid = await bcrypt.compare(password, user.password);

    if (valid && email === user.email) {
      await this.userRepository.remove(user);
      return true;
    } else {
      return false;
    }
  }
}
