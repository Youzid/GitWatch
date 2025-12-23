import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class MailService {
    private readonly logger = new Logger(MailService.name);

    constructor(private readonly mailerService: MailerService) { }
    async sendEmail(params: { to: string, subject: string; context: ISendMailOptions['context']}) {
        try {
            const emailsList: string[] = process.env.SMTP_TO?.split(',');

            if (!emailsList) {
                throw new Error(
                    `No recipients found in SMTP_TO env var, please check your .env file`,
                );
            }

            const sendMailParams = {
                to: params.to,
                from: process.env.SMTP_FROM,
                subject: params.subject,
                text: `Hello,\n\nThank you for registering!\n\nPlease verify your email by clicking the link below:\n\n${params.context?.verificationUrl}\n\nThis link will expire in 24 hours.\n\nBest regards`,
                context: params.context,
            };
            const response = await this.mailerService.sendMail(sendMailParams);
            this.logger.log(`Email sent successfully to recipients with the following parameters : ${JSON.stringify(sendMailParams)}`, response,);

        } catch (error) {
            this.logger.error(`Error while sending mail with the following parameters : ${JSON.stringify(params,)}`, error,);
        }
    }
}