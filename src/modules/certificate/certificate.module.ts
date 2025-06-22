import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from 'src/guards/routeAuthentication';
import { S3FileManager } from 'src/lib/s3/s3';
import { S3Service } from 'src/lib/s3/s3.service';
import { CertificateController } from './certificate.controller';
import { CreateCertificateService } from './services/create-certificate.service';
import { ListCertificateService } from './services/list.certificate.service';

@Module({
  imports: [],
  controllers: [CertificateController],
  providers: [
    CreateCertificateService,
    S3Service,
    AuthGuard,
    ConfigService,
    S3FileManager,
    ListCertificateService,
  ],
})
export class CertificatesModule {}
