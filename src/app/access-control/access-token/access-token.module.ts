import {Module} from '@nestjs/common';
import { AccessTokenService } from './access-token.service';
import { AccessTokenController } from './access-token.controller';
import {MongooseModule} from "@nestjs/mongoose";
import {AccessToken, AccessTokenSchema} from "./entities/access-token.entity";
import {AccessTokenRepository} from "@app/access-control/access-token/access-token.repository";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: AccessToken.name, schema: AccessTokenSchema }]),
  ],
  controllers: [AccessTokenController],
  providers: [AccessTokenService,AccessTokenRepository],
  exports: [AccessTokenService]
})
export class AccessTokenModule {}
