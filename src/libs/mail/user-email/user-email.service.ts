import { Injectable } from '@nestjs/common';
import { User } from "@app/v1/REST/entities/user.entity";
import { appInfo } from "@config/config";
import { EmailEngineService } from "@libs/mail/email-engine/email-engine.service";

@Injectable()
export class UserEmailService {

  constructor(private readonly emailEngineService: EmailEngineService ) {}

  async sendWelcomeMessage(user: User){
    const { email, emailVerificationToken,  } = user;
    const { appName } = appInfo;

    const payload = {
      user: {
        email: email,
        token: emailVerificationToken
      }
    }

    const subject: string = `Welcome To ${appName}`
    await this.emailEngineService.sendHtmlEmail([email],  subject, `welcome-with-verification-token`, payload);
  }
}
