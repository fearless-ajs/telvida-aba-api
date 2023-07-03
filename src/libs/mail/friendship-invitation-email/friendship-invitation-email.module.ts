import { Module } from '@nestjs/common';
import { FriendshipInvitationEmailService } from './friendship-invitation-email.service';
import { EmailEngineModule } from "@libs/mail/email-engine/email-engine.module";

@Module({
  imports: [
    EmailEngineModule,
  ],
  providers: [FriendshipInvitationEmailService],
  exports: [FriendshipInvitationEmailService]
})
export class FriendshipInvitationEmailModule {}
