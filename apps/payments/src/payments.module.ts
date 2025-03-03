import { LoggerModule, NOTIFICATION_SERVICE } from '@app/common';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import * as Joi from 'joi';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        PORT: Joi.number().required(),
        STRIPE_SECRET_KEY: Joi.string().required(),
        NOTIFICATION_HOST: Joi.string().required(),
        NOTIFICATION_PORT: Joi.number().required()
      })
    }),
    LoggerModule,
    ClientsModule.registerAsync([
      {
        name: NOTIFICATION_SERVICE,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get('NOTIFICATION_HOST'),
            port: configService.get('NOTIFICATION_PORT')
          }
        }),
        inject: [ConfigService]
      }
    ])
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService]
})
export class PaymentsModule {}
