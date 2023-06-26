import { Module } from '@nestjs/common';
import { UserEmailService } from './user-email.service';
import { EmailEngineModule } from "@libs/mail/email-engine/email-engine.module";

@Module({
  providers: [UserEmailService],
  exports: [UserEmailService],
  imports: [
    EmailEngineModule,
  ]
})
export class UserEmailModule {}
