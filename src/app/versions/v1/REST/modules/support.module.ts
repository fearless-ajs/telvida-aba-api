import { Module } from '@nestjs/common';
import { SupportService } from '../services/support/support.service';
import { SupportController } from '../controllers/support/support.controller';
import { SupportRepository } from "@app/versions/v1/REST/repositories/support.repository";
import { MongooseModule } from "@nestjs/mongoose";
import { EmailEngineModule } from "@libs/mail/email-engine/email-engine.module";
import { Support, SupportSchema } from "@app/versions/v1/REST/entities/support.entity";
import { SupportEmailService } from "@libs/mail/support-email/support-email.service";
import { UserModule } from "@app/versions/v1/REST/modules/user.module";

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
