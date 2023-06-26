import { Module } from '@nestjs/common';
import { SupportEventListenerService } from "@libs/listeners/support-event-listener/support-event-listener.service";
import { UserEventListenerService } from "@libs/listeners/user-event-listener/user-event-listener.service";
import { AuthEventListenerService } from "@libs/listeners/auth-event-listener/auth-event-listener.service";
import { SupportEmailModule } from "@libs/mail/support-email/support-email.module";
import { AuthEmailModule } from "@libs/mail/auth-email/auth-email.module";
import { UserEmailModule } from "@libs/mail/user-email/user-email.module";

@Module({
  providers: [
    UserEventListenerService,
    AuthEventListenerService,
    SupportEventListenerService,
  ],
  imports: [
    SupportEmailModule,
    AuthEmailModule,
    UserEmailModule
  ]
})
export class EventsListenerModule {}
