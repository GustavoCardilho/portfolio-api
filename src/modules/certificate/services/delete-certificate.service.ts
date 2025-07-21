import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/lib/database/prisma.service';

@Injectable()
export class DeleteCertificateService {
  constructor(private readonly prisma: PrismaService) {}

  async deleteCertificate(id: string) {
    const certificate = await this.prisma.certificate.findUnique({
      where: { id },
    });

    if (!certificate) {
      return {
        statusCode: HttpStatus.NOT_FOUND,
        success: false,
        message: 'Certificado não encontrado',
      };
    }

    const certificateRoute = await this.prisma.certificateRoute.findMany({
      where: { id: certificate.routeId! },
    });

    if (certificateRoute.length == 1) {
      await this.prisma.certificateRoute.delete({
        where: { id: certificateRoute[0].id },
      });
    }

    await this.prisma.certificate.delete({
      where: { id },
    });

    return {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'Certificado deletado com sucesso',
    };
  }
}
