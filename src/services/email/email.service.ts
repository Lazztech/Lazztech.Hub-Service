import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Email } from './dto/email.dto';
import { EmailOptions } from './dto/emailOptions.dto';

@Injectable()
export class EmailService {
  private logger = new Logger(EmailService.name, true);
  private transporter: nodemailer.Transporter;
  public readonly primaryEmailAddress: string;

  constructor(private readonly configService: ConfigService) {
    this.logger.log('constructor');

    this.transporter = nodemailer.createTransport({
      service: 'Gmail',
      // TODO setup env configuration validation with joi
      auth: {
        user: this.configService.get<string>('EMAIL_FROM_ADDRESS'),
        pass: this.configService.get<string>('EMAIL_PASSWORD'),
      },
    });

    this.primaryEmailAddress = this.configService.get<string>(
      'EMAIL_FROM_ADDRESS',
    );
  }

  public async sendEmailFromPrimaryAddress(options: EmailOptions) {
    this.logger.log(this.sendEmailFromPrimaryAddress.name);

    return await this.sendEmail({
      from: this.configService.get<string>('EMAIL_FROM_ADDRESS'),
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    });
  }

  private async sendEmail(email: Email) {
    this.logger.log(this.sendEmail.name);

    const messageId = await this.transporter
      .sendMail(email as nodemailer.SendMailOptions)
      .then((info) => info.messageId);

    return messageId;
  }
}
