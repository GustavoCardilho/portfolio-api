import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/lib/database/prisma.service';
import { S3Service } from 'src/lib/s3/s3.service';
import { CreateCertificateDto } from '../dto/create-certificate.dto';

interface CreateCertificate {
  file: Express.Multer.File;
  id?: string;
  data?: CreateCertificateDto;
}

@Injectable()
export class CreateCertificateService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly s3Service: S3Service,
  ) {}

  async uploadCertificate({ file, id, data }: CreateCertificate) {
    try {
      const uploadFile = await this.s3Service.uploadFile(file, 'certificates', file.originalname);

      const certificate = await this.prisma.$transaction(async (tx) => {
        const upsertBody = {
          title: data?.title || '',
          description: data?.description || '',
          startDate: data?.startDate || undefined,
          endDate: data?.endDate || undefined,
          url: data?.link || '',
          CertificateFile: {
            create: {
              key: uploadFile.data?.key || '',
            },
          },
          route: {
            create: {
              path: data?.route || '',
            },
          },
        } as Prisma.CertificateCreateInput;

        await tx.certificate.upsert({
          where: {
            id: id || '',
          },
          create: upsertBody,
          update: upsertBody,
        });
      });

      return {
        statusCode: HttpStatus.OK,
        success: true,
        message: 'Certificado adicionado/atualizado com sucesso',
        data: certificate,
      };
    } catch (err: unknown) {
      console.log('err', err);
      return {
        success: false,
        message: 'Falha ao adicionar/atualizar certificado',
        error:
          err instanceof HttpException ? err.message : 'Falha ao adicionar/atualizar certificado',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  }
}
