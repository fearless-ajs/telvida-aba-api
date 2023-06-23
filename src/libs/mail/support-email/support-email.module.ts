import { Module } from '@nestjs/common';
import { SupportEmailService } from "@libs/mail/support-email/support-email.service";
import { EmailEngineModule } from "@libs/mail/email-engine/email-engine.module";

@Module({
  providers: [
    SupportEmailService
  ],
  exports: [SupportEmailService],
  imports: [
    EmailEngineModule,
  ]
})
export class SupportEmailModule {}
