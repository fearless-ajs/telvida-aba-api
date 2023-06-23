import { Module } from '@nestjs/common';
import { SupportService } from './support.service';
import { SupportController } from './support.controller';
import { SupportRepository } from "@app/support/support.repository";
import { MongooseModule } from "@nestjs/mongoose";
import { EmailEngineModule } from "@libs/mail/email-engine/email-engine.module";
import { Support, SupportSchema } from "@app/support/entities/support.entity";
import { SupportEmailService } from "@libs/mail/support-email/support-email.service";
import { UserModule } from "@app/user/user.module";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Support.name, schema: SupportSchema },
    ]),
    EmailEngineModule,
    UserModule
  ],
  controllers: [SupportController],
  providers: [SupportService, SupportRepository, SupportEmailService]
})
export class SupportModule {}
