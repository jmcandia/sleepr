import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { Logger } from 'nestjs-pino';
import { PaymentsModule } from './payments.module';

async function bootstrap() {
  const app = await NestFactory.create(PaymentsModule);
  const configService = app.get(ConfigService);
  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: configService.getOrThrow<number>('PORT')
    }
  });
  app.useLogger(app.get(Logger));
  await app.startAllMicroservices();
}
bootstrap().catch((err) => {
  console.error('An error occurred while bootstrapping the application', err);
});
