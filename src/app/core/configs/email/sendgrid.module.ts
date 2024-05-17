import { SendGridModule } from '@anchan828/nest-sendgrid';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    SendGridModule.forRoot({
      apikey: process.env.SENDGRID_API_KEY as string,
    }),
  ],
})
export class EmailModule {}
