import { forwardRef, Module } from "@nestjs/common";
import { FriendshipInvitationService } from './friendship-invitation.service';
import { FriendshipInvitationController } from './friendship-invitation.controller';
import { FriendshipInvitationRepository } from "@app/chat/friendship-invitation/friendship-invitation.repository";
import { UserModule } from "@app/user/user.module";
import { MongooseModule } from "@nestjs/mongoose";

import {
  FriendshipInvitation,
  FriendshipInvitationSchema
} from "@app/chat/friendship-invitation/entities/friendship-invitation.entity";
import { FriendshipModule } from "@app/chat/friendship/friendship.module";

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
