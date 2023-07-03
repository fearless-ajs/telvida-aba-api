import { Module } from '@nestjs/common';
import { FriendshipService } from './friendship.service';
import { FriendshipController } from './friendship.controller';
import { MongooseModule } from "@nestjs/mongoose";
import { Friendship, FriendshipSchema } from "@app/chat/friendship/entities/friendship.entity";
import { FriendshipRepository } from "@app/chat/friendship/friendship.repository";
import { UserModule } from "@app/user/user.module";

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
