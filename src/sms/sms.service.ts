import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './message.entity';
import { Twilio } from 'twilio';

@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);
  private readonly client: Twilio;

  constructor(
    @InjectRepository(Message)
    private readonly messages: Repository<Message>,
  ) {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    this.client = new Twilio(accountSid, authToken);
  }

  async sendSms(to: string, body: string): Promise<void> {
    await this.client.messages.create({
      to,
      from: process.env.TWILIO_PHONE_NUMBER,
      body,
    });

    const message = this.messages.create({ to, body });
    await this.messages.save(message);

    this.logger.log(`Sent message to ${to}`);
  }
}
