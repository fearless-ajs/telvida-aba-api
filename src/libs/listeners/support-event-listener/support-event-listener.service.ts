import { Injectable } from '@nestjs/common';
import { OnEvent } from "@nestjs/event-emitter";
import { events } from "@config/constants";
import { SupportEvent } from "@app/support/events/support.event";
import { SupportEmailService } from "@libs/mail/support-email/support-email.service";

@Injectable()
export class SupportEventListenerService {
  constructor(private readonly supportEmailService: SupportEmailService) {}

  @OnEvent(events.SUPPORT_CREATED)
  async dispatchUserSupportCreatedNotification (payload: SupportEvent) {
     const { user, support } = payload;
     await this.supportEmailService.sendUserSupportCreateMessage(user, support);
  }

  @OnEvent(events.SUPPORT_CREATED)
  async dispatchAdminSupportCreatedNotification (payload: SupportEvent) {
    const { user, support } = payload;
    await this.supportEmailService.sendAdminSupportCreateMessage(user, support);
  }

  @OnEvent(events.SUPPORT_UPDATED)
  async dispatchAdminSupportUpdatedNotification (payload: SupportEvent) {
    const { user, support } = payload;
    await this.supportEmailService.sendAdminSupportUpdateMessage(user, support);
  }

  @OnEvent(events.SUPPORT_STATUS_CHANGED)
  async dispatchUserSupportStatusChangedNotification (payload: SupportEvent) {
    const { user, support } = payload;
    await this.supportEmailService.sendUserSupportStatusChangedMessage(user, support);
  }

  @OnEvent(events.SUPPORT_STATUS_CHANGED)
  async dispatchAdminSupportStatusChangedNotification (payload: SupportEvent) {
    const { user, support } = payload;
    await this.supportEmailService.sendAdminSupportStatusChangedMessage(user, support);
  }

  @OnEvent(events.SUPPORT_STATUS_CLOSED)
  async dispatchUserSupportStatusClosedNotification (payload: SupportEvent) {
    const { user, support } = payload;
    await this.supportEmailService.sendUserSupportStatusChangedMessage(user, support);
  }

  @OnEvent(events.SUPPORT_STATUS_CLOSED)
  async dispatchAdminSupportStatusClosedNotification (payload: SupportEvent) {
    const { user, support } = payload;
    await this.supportEmailService.sendAdminSupportStatusChangedMessage(user, support);
  }


}
