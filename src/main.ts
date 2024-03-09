import { NestFactory } from '@nestjs/core';
import * as dotenv from 'dotenv';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  dotenv.config();

  await app.listen(process.env.PORT || 3000);
}

bootstrap();
