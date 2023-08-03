import { Module } from '@nestjs/common';
import { FriendshipService } from '../services/chat/friendship/friendship.service';
import { FriendshipController } from '../controllers/chat/friendship/friendship.controller';
import { MongooseModule } from "@nestjs/mongoose";
import { Friendship, FriendshipSchema } from "@app/v1/REST/entities/friendship.entity";
import { FriendshipRepository } from "@app/v1/REST/repositories/friendship.repository";
import { UserModule } from "@app/v1/REST/modules/user.module";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Friendship.name, schema: FriendshipSchema },
    ]),
    UserModule,
  ],
  controllers: [FriendshipController],
  providers: [FriendshipService, FriendshipRepository],
  exports: [FriendshipService]
})
export class FriendshipModule {}
