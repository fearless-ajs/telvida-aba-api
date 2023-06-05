import { Module } from '@nestjs/common';
import { EmailEngineService } from './email-engine.service';
import { MailerModule } from "@nestjs-modules/mailer";
import { PugAdapter } from "@nestjs-modules/mailer/dist/adapters/pug.adapter";

@Module({
  imports: [
    MailerModule.forRoot({
      // transport: {
      //   host: 'smtp.telvida.com',
      //   auth: {
      //     user: 'app.software@telvida.com',
      //     pass: 'Telvida123'
      //   }
      // },
      transport: {
        host: 'sandbox.smtp.mailtrap.io',
        auth: {
          user: '81806e976d160d',
          pass: '9a6c8b101cdbd6'
        },
        port: 2525
      },
      template: {
        dir: __dirname + '/templates',
        adapter: new PugAdapter(),
        options: {
          strict: true,
        },
      }
    }),
  ],
  providers: [EmailEngineService],
  exports: [EmailEngineService]
})
export class EmailEngineModule {}
