import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { Logger } from 'nestjs-pino';
import { ReservationsModule } from './reservations.module';

async function bootstrap() {
  const app = await NestFactory.create(ReservationsModule);
  const configService = app.get(ConfigService);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true
    })
  );
  app.useLogger(app.get(Logger));
  app.use(cookieParser());
  await app.listen(configService.getOrThrow<number>('PORT'));
}
bootstrap().catch((err) => {
  console.error('An error occurred while bootstrapping the application', err);
});
