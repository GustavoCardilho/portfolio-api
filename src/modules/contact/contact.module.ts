import { Module } from '@nestjs/common';
import { EmailService } from 'src/lib/email/email';
import { ContactController } from './contact.controller';
import { ContactService } from './contact.service';

@Module({
  providers: [ContactService, EmailService],
  controllers: [ContactController],
})
export class ContactModule {}
