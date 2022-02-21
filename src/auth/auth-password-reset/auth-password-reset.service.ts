import { Injectable, Logger } from '@nestjs/common';
import { PasswordReset } from '../../dal/entity/passwordReset.entity';
import { User } from '../../dal/entity/user.entity';
import { ResetPassword } from '../dto/resetPassword.input';
import { EmailService } from '../../email/email.service';
import * as crypto from 'crypto';
import * as bcrypt from 'bcryptjs';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/core';

@Injectable()
export class AuthPasswordResetService {
  private logger = new Logger(AuthPasswordResetService.name);

  constructor(
    private emailService: EmailService,
    @InjectRepository(PasswordReset)
    private passwordResetRepository: EntityRepository<PasswordReset>,
    @InjectRepository(User)
    private userRepository: EntityRepository<User>,
  ) {}

  public async resetPassword(details: ResetPassword) {
    this.logger.log(this.resetPassword.name);
    const user = await this.userRepository.findOne({
      email: details.usersEmail,
    });

    const passwordReset = await user.passwordReset.load();
    
    if (passwordReset?.pin === details.resetPin) {
      const hashedPassword = await bcrypt.hash(details.newPassword, 12);
      user.password = hashedPassword;
      await this.userRepository.persistAndFlush(user);
      return true;
    } else {
      return false;
    }
  }

  async sendPasswordResetEmail(email: string) {
    this.logger.log(this.sendPasswordResetEmail.name);
    const user = await this.userRepository.findOne({ email });

    if (user) {
      const pin = await this.generatePasswordResetPin();
      await this.emailService.sendEmailFromPrimaryAddress({
        to: user.email,
        subject: `Password reset for ${user.firstName} ${user.lastName}`,
        text: `Hello, ${user.firstName}, please paste in the follow to reset your password: ${pin}`,
        html: `<b>Hello, <strong>${user.firstName}</strong>, Please paste in the follow to reset your password: ${pin}</p>`,
      });

      const passwordReset = this.passwordResetRepository.create({ pin, user });
      await this.passwordResetRepository.persistAndFlush(passwordReset);

      return true;
    } else {
      return false;
    }
  }

  private async generatePasswordResetPin() {
    this.logger.log(this.generatePasswordResetPin.name);
    let pin: string;
    let isNewPin = false;
    while (!isNewPin) {
      pin = this.generateRandomPin();
      const result = await this.passwordResetRepository.findOne({ pin });
      if (!result) {
        isNewPin = true;
      }
    }
    return pin;
  }

  private generateRandomPin(): string {
    this.logger.log(this.generateRandomPin.name);
    const val = crypto.randomBytes(16).toString('hex');
    return val;
  }
}
