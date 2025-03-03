import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { NotifyEmailDto } from './dtos/notify-email.dto';

@Injectable()
export class NotificationsService {
  private readonly transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: this.configService.get('SMTP_USER'),
        clientId: this.configService.get('GOOGLE_OAUTH_CLIENT_ID'),
        clientSecret: this.configService.get('GOOGLE_OAUTH_CLIENT_SECRET'),
        refreshToken: this.configService.get('GOOGLE_OAUTH_REFRESH_TOKEN')
      },
      tls: {
        rejectUnauthorized: false
      }
    });
  }

  async notifyEmail({ email, text }: NotifyEmailDto) {
    console.log('🚀 Sending email to', email);
    try {
      await this.transporter.sendMail({
        from: this.configService.get('SMTP_USER'),
        to: email,
        subject: 'Sleepr Notification',
        text
      });
    } catch (error) {
      console.error('❌ Failed to send email', error);
    }
  }
}
