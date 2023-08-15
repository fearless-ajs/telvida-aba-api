import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import { AbstractRepository } from '@libs/database/abstract.repository';
import { CommunityMember } from '@app/v1/REST/entities/community-member.entity';

@Injectable()
export class CommunityMemberRepository extends AbstractRepository<CommunityMember> {
  protected readonly logger = new Logger(CommunityMember.name);

  constructor(
    @InjectModel(CommunityMember.name)
    communityMemberModel: Model<CommunityMember>,
    @InjectConnection() connection: Connection,
  ) {
    super(communityMemberModel, connection);
  }
}
