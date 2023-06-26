import { Injectable } from '@nestjs/common';
import { OnEvent } from "@nestjs/event-emitter";
import { events } from "@config/constants";
import { UserEmailService } from "@libs/mail/user-email/user-email.service";
import { UserEvent } from "@app/user/events/user.event";

@Injectable()
export class UserEventListenerService {
  constructor(private readonly userEmailService: UserEmailService) {}

  @OnEvent(events.USER_CREATED)
  async dispatchUserSupportCreatedNotification (payload: UserEvent) {
    const { user } = payload;
    await this.userEmailService.sendWelcomeMessage(user);
  }

}
