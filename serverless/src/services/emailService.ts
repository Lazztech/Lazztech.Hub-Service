// import nodemailer, { Transporter } from 'nodemailer';
import crypto from "crypto";
import * as nodemailer from "nodemailer";
import { Service } from "typedi";
import { PasswordReset } from "../dal/entity/passwordReset";
import { IEmailService } from "./emailService.interface";

@Service()
export class EmailService implements IEmailService {

    private transporter: nodemailer.Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: process.env.EMAIL_FROM_ADDRESS,
                pass: process.env.EMAIL_PASSWORD
            }
        });
    }

    public async sendPasswordResetEmail(email: string, name: string): Promise<string> {

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
            from: process.env.EMAIL_FROM_ADDRESS,
            to: email,
            subject: `Password reset for ${name}!`,
            text: `Hello, ${name}, please paste in the follow to reset your password: ${pin}`,
            html: `<b>Hello, <strong>${name}</strong>, Please paste in the follow to reset your password: ${pin}</p>`
        } as nodemailer.SendMailOptions;

        const messageId = await this.transporter.sendMail(mailOptions).then((info) => info.messageId);

        if (messageId) {
            return pin;
        } else {
            console.error("Email send failed.");
            return null;
        }
    }

    public async sendErrorToFromAddress(text: string): Promise<void> {
        const mailOptions: nodemailer.SendMailOptions = {
            from: process.env.EMAIL_FROM_ADDRESS,
            to: process.env.EMAIL_FROM_ADDRESS,
            subject: "Server Error!",
            text,
        } as nodemailer.SendMailOptions;

        const messageId = await this.transporter.sendMail(mailOptions).then((info) => info.messageId);
    }

    public async sendEmailToFromAddress(subject: string, text: string): Promise<void> {
        const mailOptions: nodemailer.SendMailOptions = {
            from: process.env.EMAIL_FROM_ADDRESS,
            to: process.env.EMAIL_FROM_ADDRESS,
            subject,
            text,
        } as nodemailer.SendMailOptions;

        const messageId = await this.transporter.sendMail(mailOptions).then((info) => info.messageId);
    }

    public async sendInviteEmail(toAddress: string): Promise<void> {
        const mailOptions: nodemailer.SendMailOptions = {
            from: toAddress,
            to: process.env.EMAIL_FROM_ADDRESS,
            subject: `${process.env.APP_NAME} Invite`,
            text: `You've been invited to register on ${process.env.APP_NAME}! Just use the email address you've received this at when you register.`,
        } as nodemailer.SendMailOptions;

        const messageId = await this.transporter.sendMail(mailOptions).then((info) => info.messageId);
    }

    private generateRandomPin(): string {
        const val = crypto.randomBytes(16).toString("hex");
        return val;
    }
}
