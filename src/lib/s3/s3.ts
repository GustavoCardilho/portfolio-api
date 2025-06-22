import { S3, S3ClientConfig } from '@aws-sdk/client-s3';
import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Readable } from 'stream';
import { v4 as uuidv4 } from 'uuid';

type UploadResult = {
  name: string;
  url: string;
  success: boolean;
  error?: string;
};

@Injectable()
export class S3FileManager {
  private s3Client: S3;
  private awsConfig: any;

  constructor(private configService: ConfigService) {
    this.awsConfig = this.configService.get<any>('aws');

    const s3ClientConfig: S3ClientConfig = {
      region: this.awsConfig.region,
      credentials: {
        accessKeyId: this.awsConfig.accessKey,
        secretAccessKey: this.awsConfig.secretKey,
      },
    };

    if (this.awsConfig.endpoint && this.awsConfig.endpoint !== '') {
      s3ClientConfig.forcePathStyle = false;
      s3ClientConfig.endpoint = this.awsConfig.endpoint;
    }

    this.s3Client = new S3(s3ClientConfig);
  }

  private async verifyFolder(folderName: string): Promise<boolean> {
    const { Contents } = await this.s3Client.listObjects({
      Bucket: this.awsConfig.bucket,
      Prefix: `${folderName}/`,
    });

    return Contents && Contents?.length > 0 ? true : false;
  }

  async createFolder(folderName: string): Promise<void> {
    if (await this.verifyFolder(folderName)) return;

    try {
      await this.s3Client.putObject({
        Bucket: this.awsConfig.bucket,
        Key: `${folderName}/`,
        Body: '',
      });
    } catch (error) {
      throw new Error(`Erro ao criar a pasta: ${error.message}`);
    }
  }

  async uploadFiles(folderName: string, files: Express.Multer.File[]): Promise<UploadResult[]> {
    return Promise.all(files.map((file) => this.uploadFile(folderName, file)));
  }

  async uploadFile(
    folderName: string,
    file: Express.Multer.File,
    isOriginalName?: boolean,
  ): Promise<UploadResult> {
    const fileExtension = (file.originalname.match(/\.([a-zA-Z0-9]+)$/) || [])[1];
    const newFileName = `${isOriginalName ? file.originalname : uuidv4() + '.' + fileExtension}`;

    try {
      await this.s3Client.putObject({
        Bucket: this.awsConfig.bucket,
        Key: `${folderName}/${newFileName}`,
        Body: file.buffer,
        ACL: 'public-read',
      });

      const url =
        this.awsConfig.endpoint && this.awsConfig.endpoint !== ''
          ? `${this.awsConfig.endpoint}/${this.awsConfig.bucket}/${folderName}/${newFileName}`
          : `https://${this.awsConfig.bucket}.s3.${this.awsConfig.region}.amazonaws.com/${folderName}/${newFileName}`;

      return {
        name: newFileName,
        url: url,
        success: true,
      };
    } catch (error) {
      throw new Error(`Erro ao enviar o arquivo: ${error.message}`);
    }
  }

  async deleteFile(folder: string, filename: string): Promise<boolean> {
    try {
      await this.s3Client.deleteObject({
        Bucket: this.awsConfig.bucket,
        Key: `${folder}/${filename}`,
      });
    } catch (error) {
      throw new Error(`Erro ao deleta o arquivo: ${error.message}`);
    }
    return true;
  }

  private streamToBuffer(stream: Readable): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];
      stream.on('data', (chunk) =>
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)),
      );
      stream.on('end', () => resolve(Buffer.concat(chunks)));
      stream.on('error', reject);
    });
  }

  async getFile(objectKey: string): Promise<Buffer | HttpException | null> {
    try {
      const response = await this.s3Client.getObject({
        Bucket: this.awsConfig.bucket,
        Key: objectKey,
      });

      if (response?.Body instanceof Buffer) {
        return response?.Body;
      }

      if (response?.Body instanceof Readable) {
        const data = await this.streamToBuffer(response.Body);
        return data;
      }

      return new HttpException(
        `Erro ao recuperar o arquivo: O corpo da resposta não é um Buffer.`,
        400,
      );
    } catch (error) {
      if (error?.code === 'NoSuchKey') {
        return null;
      }

      return new HttpException(`Erro ao recuperar o arquivo: ${error?.message}`, 400);
    }
  }
}
