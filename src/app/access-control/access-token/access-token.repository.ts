import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import { AbstractRepository } from "@libs/database/abstract.repository";
import { AccessToken } from './entities/access-token.entity';


@Injectable()
export class AccessTokenRepository extends AbstractRepository<AccessToken> {
  protected readonly logger = new Logger(AccessTokenRepository.name);

  constructor(
    @InjectModel(AccessToken.name) accessTokenModel: Model<AccessToken>,
    @InjectConnection() connection: Connection,
  ) {
    super(accessTokenModel, connection);
  }
}
