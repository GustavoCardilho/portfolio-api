import { Type } from 'class-transformer';
import { IsDateString, IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator';

export class CreateCertificateDto {
  @IsString({
    message: 'O título deve ser uma string',
  })
  @IsNotEmpty({
    message: 'O título é obrigatório',
  })
  title: string;

  @IsString({
    message: 'A descrição deve ser uma string',
  })
  @IsNotEmpty({
    message: 'A descrição é obrigatória',
  })
  description: string;

  @IsString({
    message: 'A categoria deve ser uma string',
  })
  @IsNotEmpty({
    message: 'A categoria é obrigatória',
  })
  @Type(() => CertificateCategory)
  @ValidateNested({ each: true })
  category: CertificateCategory[];

  @IsDateString({}, { message: 'A data de início deve ser uma data válida' })
  @IsNotEmpty({ message: 'A data de início é obrigatória' })
  startDate: Date;

  @IsDateString({}, { message: 'A data de término deve ser uma data válida' })
  @IsNotEmpty({ message: 'A data de término é obrigatória' })
  endDate: Date;

  @IsString({
    message: 'O link deve ser uma string',
  })
  @IsNotEmpty({
    message: 'O link é obrigatório',
  })
  link: string;
}

export class CertificateCategory {
  @IsString({
    message: 'O nome da categoria deve ser uma string',
  })
  @IsNotEmpty({
    message: 'O nome da categoria é obrigatório',
  })
  name: string;

  @IsNumber(
    {},
    {
      message: 'A ordem deve ser um número',
    },
  )
  @IsNotEmpty({
    message: 'A ordem é obrigatória',
  })
  order: number;
}
