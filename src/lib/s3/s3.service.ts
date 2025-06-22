import { HttpStatus, Injectable } from '@nestjs/common';
import { S3FileManager } from './s3';

@Injectable()
export class S3Service {
  constructor(private s3: S3FileManager) {}

  async uploadFile(
    file: Express.Multer.File,
    folderName: string,
    currentFile?: string,
    isOriginalName?: boolean,
  ) {
    try {
      if (currentFile) await this.deleteFile(folderName, currentFile);
      const upload = await this.s3.uploadFile(folderName, file, isOriginalName);

      const data = {
        name: file.originalname,
        url: upload.url,
        key: upload.name,
      };

      return {
        status: HttpStatus.OK,
        message: 'Imagem enviada com sucesso.',
        data,
      };
    } catch (error) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Erro ao enviar imagem.',
        data: null,
        error: error.message,
      };
    }
  }

  async deleteFile(folderName: string, filename: string) {
    try {
      await this.s3.deleteFile(folderName, filename);

      return {
        status: HttpStatus.OK,
        message: 'Imagem deletada com sucesso.',
        data: null,
      };
    } catch (error) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Erro ao deletar imagem.',
        data: null,
        error: error.message,
      };
    }
  }
}
