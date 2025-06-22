import { ConfigModule } from '@nestjs/config';
import { configurations } from './configurations';

ConfigModule.forRoot({
  envFilePath: '.env',
  isGlobal: true,
  load: [configurations],
});
