import { HttpStatus, Injectable } from '@nestjs/common';
import { EmailService } from 'src/lib/email/email';

@Injectable()
export class ContactService {
  constructor(private readonly emailService: EmailService) {}

  async sendContactEmail(email: string, name: string, message: string) {
    try {
      const text = `
        <p>Name: ${name}</p>
        <p>Email: ${email}</p>
        <p>Message: ${message}</p>
        `;

      await this.emailService.sendEmail(
        'gustavorafael1106@gmail.com',
        'Portfolio: Tentativa de contato do(a) ' + name,
        text,
      );

      return {
        success: true,
        message: 'Email sent successfully',
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to send email',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  }

  async infoEmail(email: string, name: string, message: string) {
    try {
      return {
        success: true,
        message: 'Email info retrieved successfully',
        statusCode: HttpStatus.OK,
        data: {
          email,
          name,
          message,
        },
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to get email info',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  }
}
