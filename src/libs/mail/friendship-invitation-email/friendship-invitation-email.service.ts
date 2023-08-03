import { Injectable } from '@nestjs/common';
import { EmailEngineService } from "@libs/mail/email-engine/email-engine.service";
import { User } from "@app/v1/REST/entities/user.entity";
import { appInfo } from "@config/config";

@Injectable()
export class FriendshipInvitationEmailService {
  constructor(private readonly emailEngineService: EmailEngineService ) {}

  async sendFriendshipInvitationCreateMessage(sender: User, receiver: User){
    const { email  } = receiver;
    const { appName } = appInfo;

    const payload = {
      sender,
      receiver,
    }

    const subject: string = `${appName} -  New Friendship Invitation`
    await this.emailEngineService.sendHtmlEmail([email],  subject, `friendship-invitation/friendship-invitation-create`, payload);
  }

  async sendFriendshipInvitationAcceptedMessage(sender: User, receiver: User){
    const { email  } = sender;
    const { appName } = appInfo;

    const payload = {
      sender,
      receiver,
    }

    const subject: string = `${appName} -  Friendship Accepted!`
    await this.emailEngineService.sendHtmlEmail([email],  subject, `friendship-invitation/friendship-invitation-accepted`, payload);
  }

  async sendFriendshipInvitationDeclinedMessage(sender: User, receiver: User){
    const { email  } = sender;
    const { appName } = appInfo;

    const payload = {
      sender,
      receiver,
    }

    const subject: string = `${appName} -  Friendship Invitation Update!`
    await this.emailEngineService.sendHtmlEmail([email],  subject, `friendship-invitation/friendship-invitation-declined`, payload);
  }

}
