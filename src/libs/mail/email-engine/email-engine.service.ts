import { Injectable } from '@nestjs/common';
import { MailerService } from "@nestjs-modules/mailer";
import { appInfo } from "@config/config";

@Injectable()
export class EmailEngineService {
  private from_email: string = "app.software@telvida.com";
  private appInfo: any;

  constructor(private mailerService: MailerService) {
    const { appEmail, appName, companyName, companyPhone } = appInfo;
    this.appInfo = {
      name: appName,
      email: appEmail,
      companyName: companyName,
      phone: companyPhone
    }

  }

  async sendEmail(from: string, to: string[],  subject: string, cc: string[], context: string=null, payload: any): Promise<boolean> {

    await this.mailerService.sendMail({
      to: to,
      from: from,
      cc: cc,
      subject: subject,
      template: (context && context === 'html')? 'html-framework' : 'plain-framework',
      context: {
        payload: payload
      },
    }).then(res =>{
      // Do something in the future


    }).catch(err =>{
      // Log the error
      console.log(err)
    })
    return true;
  }


  async sendHtmlEmail(to: string[], subject: string, template: string, payload: any){
    payload.appInfo = this.appInfo;
    await this.mailerService.sendMail({
      to,
      from: this.from_email,
      subject,
      template,
      context: {
        payload: payload
      }
    }).then(res =>{
      // Do something in the future

    }).catch(err =>{
      // Log the error
      console.log(err)
    })
    return true;
  }

}
