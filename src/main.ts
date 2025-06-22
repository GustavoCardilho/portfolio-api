import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  try {
    console.log('🚀 Iniciando aplicação NestJS...');
    console.log('📊 Variáveis de ambiente:');
    console.log('   NODE_ENV:', process.env.NODE_ENV);
    console.log('   PORT:', process.env.PORT);
    console.log('   DATABASE_URL:', process.env.DATABASE_URL ? 'Configurado' : 'Não configurado');

    const app = await NestFactory.create(AppModule);

    const port = process.env.PORT ?? 3000;

    console.log('✅ Aplicação criada com sucesso');
    console.log('🌐 Servidor rodando na porta:', port);
    console.log('🏥 Health check:', `http://localhost:${port}/health`);

    app.enableCors({
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    });

    await app.listen(port);

    console.log('🎉 Aplicação iniciada com sucesso!');
    console.log('📡 Aguardando conexões...');
  } catch (error) {
    console.error('❌ Erro ao iniciar aplicação:', error);
    process.exit(1);
  }
}

bootstrap().catch((error) => {
  console.error('❌ Erro fatal na aplicação:', error);
  process.exit(1);
});
