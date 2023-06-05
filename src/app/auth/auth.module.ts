import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import {UserModule} from "../user/user.module";
import {DatabaseModule} from "@libs/database/database.module";
import { RefreshTokenStrategy } from "@app/auth/strategies/refresh-token.strategy";
import { AuthEmailService } from "@libs/mail/auth-email/auth-email.service";
import { EmailEngineModule } from "@libs/mail/email-engine/email-engine.module";

@Module({
  imports: [
    DatabaseModule,
    UserModule,
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
      }),
      inject: [ConfigService],
    }),
    EmailEngineModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthEmailService, LocalStrategy, JwtStrategy, RefreshTokenStrategy],
})
export class AuthModule {}
