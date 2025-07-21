import { ConfigModule } from '@nestjs/config';
import { configurations } from './configurations';

export const config = ConfigModule.forRoot({
  envFilePath: '.env',
  isGlobal: true,
  load: [configurations],
});
