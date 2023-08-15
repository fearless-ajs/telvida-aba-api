import { forwardRef, Module } from "@nestjs/common";
import { CommunityService } from '../services/group/community/community.service';
import { CommunityController } from '@app/v1/REST/controllers/group/community/community.controller';
import { CommunityRepository } from '@app/v1/REST/repositories/community.repository';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Community,
  CommunitySchema,
} from '@app/v1/REST/entities/community.entity';
import { CommunityMemberModule } from '@app/v1/REST/modules/community-member.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Community.name, schema: CommunitySchema },
    ]),
    // forwardRef(() => CommunityMemberModule),
    CommunityMemberModule,
  ],
  controllers: [CommunityController],
  providers: [CommunityService, CommunityRepository],
  exports: [CommunityService],
})
export class CommunityModule {}
