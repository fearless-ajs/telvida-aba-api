import {Module} from '@nestjs/common';
import { AccessTokenService } from '../services/access-token/access-token.service';
import { AccessTokenController } from '../controllers/access-token/access-token.controller';
import {MongooseModule} from "@nestjs/mongoose";
import {AccessToken, AccessTokenSchema} from "../entities/access-token.entity";
import {AccessTokenRepository} from "@app/v1/REST/repositories/access-token.repository";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: AccessToken.name, schema: AccessTokenSchema }]),
  ],
  controllers: [AccessTokenController],
  providers: [AccessTokenService,AccessTokenRepository],
  exports: [AccessTokenService]
})
export class AccessTokenModule {}
