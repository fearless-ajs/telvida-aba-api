import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import { AbstractRepository } from '@libs/database/abstract.repository';
import { Community } from '@app/v1/REST/entities/community.entity';

@Injectable()
export class CommunityRepository extends AbstractRepository<Community> {
  protected readonly logger = new Logger(Community.name);

  constructor(
    @InjectModel(Community.name) communityModel: Model<Community>,
    @InjectConnection() connection: Connection,
  ) {
    super(communityModel, connection);
  }
}
