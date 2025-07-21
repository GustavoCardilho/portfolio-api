import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/lib/database/prisma.service';
import { S3Service } from 'src/lib/s3/s3.service';

@Injectable()
export class ListCertificateService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly s3Service: S3Service,
  ) {}

  async listCertificatesDetails() {
    const certificates = await this.prisma.certificateRoute.findMany({
      include: {
        certificates: {
          include: {
            CertificateFile: true,
            route: true,
          },
        },
      },
    });

    let certificatesWithUrl: any[] = [];
    for await (const certificate of certificates) {
      for await (const certificateFile of certificate.certificates) {
        const certificateWithUrl = await this.s3Service.getFileUrl(
          certificateFile.CertificateFile?.key || '',
        );
        if (certificateWithUrl) {
          certificatesWithUrl.push({
            ...certificate,
            certificates: [
              {
                ...certificateFile,
                CertificateFile: {
                  ...certificateFile.CertificateFile,
                  url: certificateWithUrl,
                },
              },
            ],
          });
        } else {
          certificatesWithUrl.push({
            ...certificate,
            certificates: [
              {
                ...certificateFile,
                CertificateFile: {
                  ...certificateFile.CertificateFile,
                  url: null,
                },
              },
            ],
          });
        }
      }
    }

    return {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'Certificados listados com sucesso',
      data: certificatesWithUrl,
    };
  }

  async getCertificate(id: string) {
    const certificate = await this.prisma.certificate.findUnique({
      where: { id },
      include: {
        CertificateFile: true,
        route: true,
      },
    });

    if (!certificate) {
      return {
        statusCode: HttpStatus.NOT_FOUND,
        success: false,
        message: 'Certificado não encontrado',
      };
    }

    const formattedCertificate = {
      ...certificate,
      CertificateFile: {
        ...certificate.CertificateFile,
        url: certificate.CertificateFile
          ? await this.s3Service.getFileUrl(certificate.CertificateFile.key)
          : null,
      },
      route: {
        ...certificate.route,
      },
    };

    return {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'Certificado listado com sucesso',
      data: formattedCertificate,
    };
  }

  async listCertificates() {
    const certificates = await this.prisma.certificateRoute.findMany({
      select: {
        path: true,
        certificates: {
          select: {
            title: true,
            id: true,
          },
        },
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
