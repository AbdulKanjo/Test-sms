import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SmsModule } from './sms/sms.module';
import { Message } from './sms/message.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [Message],
      synchronize: true,
    }),
    SmsModule,
  ],
})
export class AppModule {}
