import { forwardRef, Module } from "@nestjs/common";
import { FriendshipInvitationService } from '../services/chat/friendship-invitation/friendship-invitation.service';
import { FriendshipInvitationController } from '../controllers/chat/friendship-invitation/friendship-invitation.controller';
import { FriendshipInvitationRepository } from "@app/v1/REST/repositories/friendship-invitation.repository";
import { UserModule } from "@app/v1/REST/modules/user.module";
import { MongooseModule } from "@nestjs/mongoose";

import {
  FriendshipInvitation,
  FriendshipInvitationSchema
} from "@app/v1/REST/entities/friendship-invitation.entity";
import { FriendshipModule } from "@app/v1/REST/modules/friendship.module";

@Module({
  imports: [
    UserModule,
    MongooseModule.forFeature([
      { name: FriendshipInvitation.name, schema: FriendshipInvitationSchema },
    ]),
    FriendshipModule
  ],
  controllers: [FriendshipInvitationController],
  providers: [FriendshipInvitationService, FriendshipInvitationRepository],
  exports: [FriendshipInvitationService]
})
export class FriendshipInvitationModule {}
