import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { User } from '../dal/entity/user.entity';
import { ChangePassword } from './dto/changePassword.input';
import { NotificationService } from '../notification/notification.service';
import { InAppNotificationDto } from '../notification/dto/inAppNotification.dto';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { Payload } from './dto/payload.dto';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/core';
import { ExpeditedRegistration } from './dto/expeditedRegistration.dto';
import { generateUsername } from "unique-username-generator";
import * as crypto from "crypto";

@Injectable()
export class AuthService {
  private logger = new Logger(AuthService.name);

  constructor(
    private readonly configService: ConfigService,
    private notificationService: NotificationService,
    @InjectRepository(User)
    private userRepository: EntityRepository<User>,
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async expeditedRegistration(): Promise<ExpeditedRegistration> {
    this.logger.debug(this.expeditedRegistration.name);
    const password = this.generatePassword();
    const hashedPassword = await bcrypt.hash(password, 12);
    const username = this.generateUsername();
    const user = this.userRepository.create({
      username,
      password: hashedPassword,
    });
    await this.userRepository.persistAndFlush(user);
    return { 
      jwt: this.jwtService.sign({ userId: user.id } as Payload),
      password,
    };
  }

  generateUsername(): string {
    return generateUsername();
  }

  generatePassword(): string {
    const PASSWORD_LENGTH = 18;
    const LOWERCASE_ALPHABET = 'abcdefghijklmnopqrstuvwxyz'; // 26 chars
    const UPPERCASE_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'; // 26 chars
    const NUMBERS = '0123456789'; // 10 chars
    const SYMBOLS = ',./<>?;\'":[]\\|}{=-_+`~!@#$%^&*()'; // 32 chars
    const ALPHANUMERIC_CHARS = LOWERCASE_ALPHABET + UPPERCASE_ALPHABET + NUMBERS; // 62 chars
    const ALL_CHARS = ALPHANUMERIC_CHARS + SYMBOLS; // 94 chars

    const randomBytes = crypto.randomBytes(PASSWORD_LENGTH);
    let password = "";

    for (var i = 0; i < PASSWORD_LENGTH; i++) {
        randomBytes[i] = randomBytes[i] % ALL_CHARS.length;
        password += ALL_CHARS[randomBytes[i]];
    }
    return password;
  }

  async register(
    firstName: string,
    lastName: string,
    birthdate: string,
    email: string,
    password: string,
    phoneNumber?: string,
  ) {
    this.logger.debug(this.register.name);
    const existingUser = await this.userService.findOne(email);
    if (existingUser) {
      this.logger.debug(`User already exists with email address: ${email}`);
      return null;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    // TODO THIS SECTION SHOULD BE AN ACID TRANSACTION
    const user = this.userRepository.create({
      firstName,
      lastName,
      birthdate,
      email,
      password: hashedPassword,
      phoneNumber,
    } as any);
    await this.userRepository.persistAndFlush(user);

    await this.notificationService.addInAppNotificationForUser(user.id, {
      text: `You'll find your notifications here.
            You can pull down to refresh and check for more.`,
      date: Date.now().toString(),
    } as InAppNotificationDto);

    return this.jwtService.sign({ userId: user.id } as Payload);
  }

  public async login(password: string, email: string) {
    this.logger.debug(this.login.name);
    const user = await this.userService.findOne(email);

    if (!user) {
      throw new Error(`User not found by email address: ${email}`)
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      throw new Error(`Password not valid for user.id: ${user.id}.`);
    }

    return this.jwtService.sign({ userId: user.id } as Payload);
  }

  public async changePassword(userId: any, details: ChangePassword) {
    this.logger.debug(this.changePassword.name);
    const user = await this.userRepository.findOne({ id: userId });
    // TODO Should it invalidate/blacklist the jwt?
    const valid = await bcrypt.compare(details.oldPassword, user.password);

    if (valid) {
      const newHashedPassword = await bcrypt.hash(details.newPassword, 12);
      user.password = newHashedPassword;
      await this.userRepository.persistAndFlush(user);

      return true;
    } else {
      return false;
    }
  }

  public async deleteAccount(userId: number, email: string, password: string) {
    this.logger.debug(this.deleteAccount.name);
    const user = await this.userRepository.findOne({ id: userId });

    const valid = await bcrypt.compare(password, user.password);

    if (valid && email === user.email) {
      await this.userRepository.removeAndFlush(user);
      return true;
    } else {
      return false;
    }
  }
}
