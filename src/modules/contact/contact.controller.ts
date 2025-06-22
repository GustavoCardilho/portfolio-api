import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { ContactService } from './contact.service';

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  async sendContactEmail(
    @Body() body: { email: string; name: string; message: string },
    @Res() res: Response,
  ) {
    const { email, name, message } = body;
    const result = await this.contactService.sendContactEmail(email, name, message);
    return res.status(result.statusCode).json(result);
  }

  @Get()
  async infoEmail(
    @Query() query: { email: string; name: string; message: string },
    @Res() res: Response,
  ) {
    const { email, name, message } = query;
    const result = await this.contactService.infoEmail(email, name, message);
    return res.status(result.statusCode).json(result);
  }
}
