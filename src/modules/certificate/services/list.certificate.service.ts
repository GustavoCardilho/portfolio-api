import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/lib/database/prisma.service';

@Injectable()
export class ListCertificateService {
  constructor(private readonly prisma: PrismaService) {}

  async listCertificates() {
    const certificates = await this.prisma.certificate.findMany({
      include: {
        CertificateFile: true,
        category: true,
      },
      orderBy: {
        category: {
          order: 'asc',
        },
        startDate: 'desc',
      },
    });

    return {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'Certificados listados com sucesso',
      data: certificates,
    };
  }
}
