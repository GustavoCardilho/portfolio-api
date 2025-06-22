import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
  private readonly resend: Resend;

  constructor(private readonly configService: ConfigService) {
    this.resend = new Resend(this.configService.get('email.apiKey'));
  }

  async sendEmail(to: string, subject: string, text: string) {
    const { data, error } = await this.resend.emails.send({
      from: this.configService.get('email.from') as string,
      to: to,
      subject: subject,
      html: text,
      tags: [{ name: 'portfolio', value: 'true' }],
      text: text,
    });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }
}
