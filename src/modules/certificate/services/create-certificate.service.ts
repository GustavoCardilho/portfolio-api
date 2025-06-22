import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma } from 'generated/prisma';
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

      const categories = await Promise.all(
        data?.category?.map(async (item) => {
          const findCategory = await this.prisma.certificateCategory.findFirst({
            where: {
              name: item.name.toUpperCase(),
            },
          });

          if (findCategory) return undefined;

          return item;
        }) ?? [],
      );

      const certificate = await this.prisma.$transaction(async (tx) => {
        const upsertBody = {
          title: data?.title || '',
          description: data?.description || '',
          id,
          startDate: data?.startDate || undefined,
          endDate: data?.endDate || undefined,
          url: data?.link || '',
          CertificateFile: {
            create: {
              url: uploadFile.data?.url || '',
            },
          },
        } as Prisma.CertificateCreateInput;

        const certificate = await tx.certificate.upsert({
          where: {
            id,
          },
          create: upsertBody,
          update: upsertBody,
        });

        await Promise.all(
          categories.filter(Boolean).map(async (item) => {
            if (!item) return undefined;

            return tx.certificateCategory.create({
              data: {
                name: item.name.toUpperCase() || '',
                order: item.order || 0,
                certificates: {
                  connect: {
                    id: certificate.id,
                  },
                },
              },
            });
          }) ?? [],
        );
      });

      return {
        statusCode: HttpStatus.OK,
        success: true,
        message: 'Certificado adicionado/atualizado com sucesso',
        data: certificate,
      };
    } catch (err: unknown) {
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
