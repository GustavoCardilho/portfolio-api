import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { RouteAuthenticationGuard } from 'src/guards/routeAuthentication';
import { CreateCertificateDto } from './dto/create-certificate.dto';
import { CreateCertificateService } from './services/create-certificate.service';
import { DeleteCertificateService } from './services/delete-certificate.service';
import { ListCertificateService } from './services/list.certificate.service';

@Controller('certificates')
export class CertificateController {
  constructor(
    private readonly createCertificateService: CreateCertificateService,
    private readonly listCertificateService: ListCertificateService,
    private readonly deleteCertificateService: DeleteCertificateService,
  ) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @RouteAuthenticationGuard()
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
    @Query('id') id?: string,
    @Body() data?: CreateCertificateDto,
  ) {
    console.log('uploadFile');
    const response = await this.createCertificateService.uploadCertificate({ file, id, data });
    return res.status(response.statusCode).json(response);
  }

  @Get('list')
  async listCertificates(@Res() res: Response) {
    const response = await this.listCertificateService.listCertificates();
    return res.status(response.statusCode).json(response);
  }

  @Get('list/details')
  async listCertificatesDetails(@Res() res: Response) {
    const response = await this.listCertificateService.listCertificatesDetails();
    return res.status(response.statusCode).json(response);
  }

  @Get('list/:id')
  async getCertificate(@Res() res: Response, @Param('id') id: string) {
    const response = await this.listCertificateService.getCertificate(id);
    return res.status(response.statusCode).json(response);
  }

  @Delete('delete/:id')
  async deleteCertificate(@Res() res: Response, @Param('id') id: string) {
    const response = await this.deleteCertificateService.deleteCertificate(id);
    return res.status(response.statusCode).json(response);
  }
}
