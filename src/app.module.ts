import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { config } from './lib/config/config';
import { configurations } from './lib/config/configurations';
import { PrismaModule } from './lib/database/prisma.module';
import { CertificatesModule } from './modules/certificate/certificate.module';
import { ContactModule } from './modules/contact/contact.module';
import { HealthController } from './modules/health/health.controller';

@Module({
  imports: [
    config,
    PrismaModule,
    CertificatesModule,
    ContactModule,
  ],
  controllers: [HealthController],
  providers: [],
})
export class AppModule {}
