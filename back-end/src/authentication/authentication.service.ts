import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/dal/entity/user.entity';
import { Repository } from 'typeorm';
import { InAppNotification } from 'src/dal/entity/inAppNotification.entity';
import { JoinUserInAppNotifications } from 'src/dal/entity/joinUserInAppNotifications.entity';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { EmailService } from 'src/services/email/email.service';
import { PasswordReset } from 'src/dal/entity/passwordReset.entity';
import { ResetPassword } from './dto/resetPassword.input';
import { ChangePassword } from './dto/changePassword.input';

@Injectable()
export class AuthenticationService {
    private logger = new Logger(AuthenticationService.name);

    constructor(
        private emailService: EmailService,
        private readonly configService: ConfigService,
        @InjectRepository(PasswordReset)
        private passwordResetRepository: Repository<PasswordReset>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(InAppNotification)
        private inAppNotificationRepository: Repository<InAppNotification>,
        @InjectRepository(JoinUserInAppNotifications)
        private joinUserInAppNotificationRepository: Repository<JoinUserInAppNotifications>,
    ) { }

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

    public async changePassword(userId: any, details: ChangePassword) {
        const user = await this.userRepository.findOne({ where: { id: userId } });

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
        const user = await this.userRepository.findOne({ where: { id: userId } });

        const valid = await bcrypt.compare(password, user.password);

        if (valid && email === user.email) {
            await this.userRepository.remove(user);
            return true;
        } else {
            return false;
        }
    }

    public async resetPassword(details: ResetPassword) {
        const user = await this.userRepository.findOne({
            where: { email: details.usersEmail },
            relations: ['passwordReset'],
          });
      
          const pinMatches = user.passwordReset.pin === details.resetPin;
      
          if (pinMatches) {
            const hashedPassword = await bcrypt.hash(details.newPassword, 12);
            user.password = hashedPassword;
            await this.userRepository.save(user);
            return true;
          } else {
            return false;
          }
    }

    async sendPasswordResetEmail(email: string) {
        const user = await this.userRepository.findOne({
            where: { email },
            relations: ['passwordReset'],
        });

        if (user) {
            const pin = await this.emailService.sendPasswordResetEmail(
                user.email,
                `${user.firstName} ${user.lastName}`,
            );
            user.passwordReset = await this.passwordResetRepository.create({ pin });
            await this.userRepository.save(user);
            return true;
        } else {
            return false;
        }
    }
}
