import { Injectable } from '@nestjs/common';
import { EmailEngineService } from "@libs/mail/email-engine/email-engine.service";
import { User } from "@app/v1/REST/entities/user.entity";
import { appInfo } from "@config/config";
import { Support } from "@app/v1/REST/entities/support.entity";

@Injectable()
export class SupportEmailService {
  constructor(private readonly emailEngineService: EmailEngineService ) {}

  async sendUserSupportCreateMessage(user: User, support: Support){
    const { email, firstname  } = user;
    const { appName } = appInfo;

    const payload = {
      user: {
        email,
        firstname
      },
      support
    }

    const subject: string = `${appName} - Support Request Confirmation`
    await this.emailEngineService.sendHtmlEmail([email],  subject, `user-support-create`, payload);
  }

  async sendAdminSupportCreateMessage(user: User, support: Support){
    const { email, firstname  } = user;
    const { appName } = appInfo;

    const payload = {
      user: {
        email,
        firstname
      },
      support
    }
    const subject: string = `${appName} - New Support Request Received`
    await this.emailEngineService.sendHtmlEmail([email],  subject, `admin-support-create`, payload);
  }

  async sendAdminSupportUpdateMessage(user: User, support: Support){
    const { email, firstname  } = user;
    const { appName } = appInfo;

    const payload = {
      user: {
        email,
        firstname
      },
      support
    }
    const subject: string = `${appName} - Support Request Updated`
    await this.emailEngineService.sendHtmlEmail([email],  subject, `admin-support-update`, payload);
  }

  async sendUserSupportStatusChangedMessage(user: User, support: Support){
    const { email, firstname  } = user;
    const { appName } = appInfo;

    const payload = {
      user: {
        email,
        firstname
      },
      support
    }

    let subject: string = '';
    if (support.status === 'closed'){
      subject = `${appName} -  Support Request Closed`
    }else{
      subject = `${appName} -  Support Request Status Updated`
    }
    await this.emailEngineService.sendHtmlEmail([email],  subject, `${(support.status === 'closed')? 'support/user-support-status-closed': 'support/user-support-status-changed'}`, payload);
  }

  async sendAdminSupportStatusChangedMessage(user: User, support: Support){
    const { email, firstname  } = user;
    const { appName } = appInfo;

    const payload = {
      user: {
        email,
        firstname
      },
      support
    }

    let subject: string = '';
    if (support.status === 'closed'){
      subject = `${appName} -  Support Request Closed`
    }else{
      subject = `${appName} -  Support Request Status Update`
    }
    await this.emailEngineService.sendHtmlEmail([email],  subject, `${(support.status === 'closed')? 'support/admin-support-status-closed': 'support/admin-support-status-changed'}`, payload);
  }

}
