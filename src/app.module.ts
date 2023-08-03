import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { UserModule } from '@app/v1/REST/modules/user.module';
import { DatabaseModule } from '@libs/database/database.module';
import { AuthModule } from '@app/v1/REST/modules/auth.module';
import { APP_GUARD } from '@nestjs/core';
import JwtAuthGuard from '@libs/Guards/jwt-auth/jwt-auth.guard';
import { AccessTokenModule } from '@app/v1/REST/modules/access-token.module';
import { ProtectedRouteGuard } from '@libs/Guards/protected-route/protected-route.guard';
import { AccessTokenRepository } from '@app/v1/REST/repositories/access-token.repository';
import { MongooseModule } from '@nestjs/mongoose';
import {
  AccessToken,
  AccessTokenSchema,
} from '@app/v1/REST/entities/access-token.entity';
import { MulterModule } from '@nestjs/platform-express';
import { EventModule } from '@app/v1/REST/modules/event.module';
import { ResourceModule } from '@app/v1/REST/modules/resource.module';
import { SupportModule } from '@app/v1/REST/modules/support.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { EventsListenerModule } from '@libs/listeners/events-listener/events-listener.module';
import { ConversationModule } from '@app/v1/REST/modules/conversation.module';
import { ConversationAttachmentModule } from '@app/v1/REST/modules/conversation-attachment.module';
import { FriendshipModule } from '@app/v1/REST/modules/friendship.module';
import { FriendshipInvitationModule } from '@app/v1/REST/modules/friendship-invitation.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AccessToken.name, schema: AccessTokenSchema },
    ]),
    EventEmitterModule.forRoot(),
    ScheduleModule.forRoot(),
    DatabaseModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        PORT: Joi.number().positive().min(5000).max(8000).required(),
        MONGODB_URI: Joi.string().required(),
        EMAIL_SERVICE_URL_V1: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        JWT_AUTH_TOKEN_EXPIRATION: Joi.string().required(),
        JWT_REFRESH_TOKEN_EXPIRATION: Joi.string().required(),
        RABBIT_MQ_URI: Joi.string().required(),
        RABBIT_MQ_ABA_QUEUE: Joi.string().required(),
      }),
      envFilePath: './.env',
    }),
    MulterModule.register({ dest: './uploads' }),
    AccessTokenModule,
    AuthModule,
    UserModule,
    EventModule,
    ResourceModule,
    SupportModule,
    EventsListenerModule,
    ConversationModule,
    ConversationAttachmentModule,
    FriendshipModule,
    FriendshipInvitationModule,
  ],
  providers: [
    AccessTokenRepository,
    {
      provide: APP_GUARD,
      useClass: ProtectedRouteGuard,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
