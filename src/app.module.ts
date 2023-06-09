import { Module } from '@nestjs/common';
import {ConfigModule} from "@nestjs/config";
import * as Joi from "joi";
import {UserModule} from "@app/user/user.module";
import {DatabaseModule} from "@libs/database/database.module";
import {RmqModule} from "@libs/rmq/rmq.module";
import { AuthModule } from "@app/auth/auth.module";
import { APP_GUARD } from "@nestjs/core";
import JwtAuthGuard from "@libs/Guards/jwt-auth/jwt-auth.guard";
import { AccessTokenModule } from "@app/access-control/access-token/access-token.module";
import { ProtectedRouteGuard } from "@libs/Guards/protected-route/protected-route.guard";
import { AccessTokenRepository } from "@app/access-control/access-token/access-token.repository";
import { MongooseModule } from "@nestjs/mongoose";
import { AccessToken, AccessTokenSchema } from "@app/access-control/access-token/entities/access-token.entity";
import { MulterModule } from "@nestjs/platform-express";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AccessToken.name, schema: AccessTokenSchema }
    ]),
    DatabaseModule,
    RmqModule,
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
        RABBIT_MQ_ABA_QUEUE: Joi.string().required()
      }),
      envFilePath: './.env',
    }),
    MulterModule.register({ dest: './uploads' }),
    AccessTokenModule,
    AuthModule,
    UserModule,
  ],
  providers: [
    AccessTokenRepository,
    {
      provide: APP_GUARD,
      useClass: ProtectedRouteGuard
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard
    },
  ]
})
export class AppModule {}