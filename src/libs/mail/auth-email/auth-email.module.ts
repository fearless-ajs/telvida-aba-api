import { Module } from '@nestjs/common';
import { EmailEngineModule } from '@libs/mail/email-engine/email-engine.module';
import { AuthEmailService } from '@libs/mail/auth-email/auth-email.service';

@Module({
  providers: [AuthEmailService],
  exports: [AuthEmailService],
  imports: [EmailEngineModule],
})
export class AuthEmailModule {}
