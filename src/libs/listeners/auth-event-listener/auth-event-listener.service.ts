import { Injectable } from "@nestjs/common";
import { AuthEmailService } from "@libs/mail/auth-email/auth-email.service";
import { OnEvent } from "@nestjs/event-emitter";
import { events } from "@config/constants";
import { UserEvent } from "@app/user/events/user.event";
import { ForgotPasswordEvent } from "@app/auth/events/forgot-password.event";
import { UserLoggedInEvent } from "@app/auth/events/user-logged-in.event";

@Injectable()
export class AuthEventListenerService {
  constructor(private readonly authEmailService: AuthEmailService) {}

  @OnEvent(events.USER_LOGGED_IN)
  async dispatchUserLoggedInEmail (payload: UserLoggedInEvent) {
    const { user } = payload;

    // Generate the current date and time in a readable format
    const date = new Date();
    const formattedDate = date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    const formattedTime = date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });

    const dateTime = `${formattedDate} at ${formattedTime}`;

    await this.authEmailService.sendUserLoggedInMessage(user, dateTime);
  }

  @OnEvent(events.VERIFICATION_TOKEN_REQUEST)
  async dispatchVerificationTokenRequestEmail (payload: UserEvent) {
    const { user } = payload;
    await this.authEmailService.resendVerificationTokenMessage(user);
  }

  @OnEvent(events.ACCOUNT_VERIFIED)
  async dispatchAccountVerificationEmail (payload: UserEvent) {
    const { user } = payload;
    await this.authEmailService.sendAccountVerificationMessage(user);
  }

  @OnEvent(events.FORGOT_PASSWORD)
  async dispatchForgotPasswordEmail (payload: ForgotPasswordEvent) {
    const { user, token } = payload;
    await this.authEmailService.sendForgotPasswordMessage(user, token);
  }

  @OnEvent(events.PASSWORD_CHANGED)
  async dispatchPasswordChangedEmail (payload: UserEvent) {
    const { user } = payload;
    await this.authEmailService.sendPasswordUpdatedMessage(user);
  }

}
