import { Test, TestingModule } from '@nestjs/testing';
import { CommunityMemberController } from './community-member.controller';
import { CommunityMemberService } from '../../../services/group/community-member/community-member.service';

describe('CommunityMemberController', () => {
  let controller: CommunityMemberController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommunityMemberController],
      providers: [CommunityMemberService],
    }).compile();

    controller = module.get<CommunityMemberController>(CommunityMemberController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
