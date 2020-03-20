// import nodemailer, { Transporter } from 'nodemailer';
import { Injectable, Logger } from '@nestjs/common';
import * as crypto from 'crypto';
import * as nodemailer from 'nodemailer';
import { PasswordReset } from '../dal/entity/passwordReset';
import { IEmailService } from './emailService.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService implements IEmailService {
  private transporter: nodemailer.Transporter;
  private logger = new Logger(EmailService.name);

  constructor(
    private readonly configService: ConfigService
  ) {
    this.logger.log("constructor");

    this.transporter = nodemailer.createTransport({
      service: 'Gmail',
      //TODO setup env configuration validation with joi
      auth: {
        user: this.configService.get<string>('EMAIL_FROM_ADDRESS'),
        pass: this.configService.get<string>('EMAIL_PASSWORD')
      },
    });
  }

  public async sendPasswordResetEmail(
    email: string,
    name: string,
  ): Promise<string> {
    this.logger.log(this.sendPasswordResetEmail.name);

    let pin: string;
    let isNewPin = false;
    while (!isNewPin) {
      pin = this.generateRandomPin();
      const result = await PasswordReset.findOne({ pin });
      if (!result) {
        isNewPin = true;
      }
    }

    const mailOptions: nodemailer.SendMailOptions = {
      from: this.configService.get<string>('EMAIL_FROM_ADDRESS'),
      to: email,
      subject: `Password reset for ${name}!`,
      text: `Hello, ${name}, please paste in the follow to reset your password: ${pin}`,
      html: `<b>Hello, <strong>${name}</strong>, Please paste in the follow to reset your password: ${pin}</p>`,
    } as nodemailer.SendMailOptions;

    const messageId = await this.transporter
      .sendMail(mailOptions)
      .then(info => info.messageId);

    if (messageId) {
      return pin;
    } else {
      console.error('Email send failed.');
      return null;
    }
  }

  public async sendErrorToFromAddress(text: string): Promise<void> {
    this.logger.log(this.sendErrorToFromAddress.name);

    const mailOptions: nodemailer.SendMailOptions = {
      from: this.configService.get<string>('EMAIL_FROM_ADDRESS'),
      to: this.configService.get<string>('EMAIL_FROM_ADDRESS'),
      subject: 'Server Error!',
      text,
    } as nodemailer.SendMailOptions;

    const messageId = await this.transporter
      .sendMail(mailOptions)
      .then(info => info.messageId);
  }

  public async sendEmailToFromAddress(
    subject: string,
    text: string,
  ): Promise<void> {
    this.logger.log(this.sendEmailToFromAddress.name);
    
    const mailOptions: nodemailer.SendMailOptions = {
      from: this.configService.get<string>('EMAIL_FROM_ADDRESS'),
      to: this.configService.get<string>('EMAIL_FROM_ADDRESS'),
      subject,
      text,
    } as nodemailer.SendMailOptions;

    const messageId = await this.transporter
      .sendMail(mailOptions)
      .then(info => info.messageId);
  }

  public async sendInviteEmail(toAddress: string): Promise<void> {
    this.logger.log(this.sendInviteEmail.name);

    const mailOptions: nodemailer.SendMailOptions = {
      from: toAddress,
      to: this.configService.get<string>('EMAIL_FROM_ADDRESS'),
      subject: `${this.configService.get<string>('APP_NAME')} Invite`,
      text: `You've been invited to register on ${this.configService.get<string>('APP_NAME')}! Just use the email address you've received this at when you register.`,
    } as nodemailer.SendMailOptions;

    const messageId = await this.transporter
      .sendMail(mailOptions)
      .then(info => info.messageId);
  }

  private generateRandomPin(): string {
    this.logger.log(this.generateRandomPin.name);

    const val = crypto.randomBytes(16).toString('hex');
    return val;
  }
}
