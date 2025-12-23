import { Controller, Get, Post } from '@nestjs/common';
import { MailService } from './mail.service';
import { Public } from '../auth/decorators/public.decorator';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Public()
  @Get()
  async sendMail(userEmail) {
    await this.mailService.sendEmail({
      to:userEmail,
      subject: 'Welcome to the Gitscope',
      context: {
        name: 'Jhon Doe',
      },
      
    });
    return "mail sent"
  };
}