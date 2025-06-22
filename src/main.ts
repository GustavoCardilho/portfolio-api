import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  console.log('Server running on port', process.env.PORT ?? 3000);
  console.log('Environment:', process.env.NODE_ENV);
  console.log('Health:', `http://localhost:${process.env.PORT ?? 3000}/health`);

  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
