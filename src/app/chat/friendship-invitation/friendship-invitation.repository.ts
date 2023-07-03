import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import { AbstractRepository } from "@libs/database/abstract.repository";
import { FriendshipInvitation } from "@app/chat/friendship-invitation/entities/friendship-invitation.entity";

@Injectable()
export class FriendshipInvitationRepository extends AbstractRepository<FriendshipInvitation> {
  protected readonly logger = new Logger(FriendshipInvitation.name);

  constructor(
    @InjectModel(FriendshipInvitation.name) friendshipInvitationModel: Model<FriendshipInvitation>,
    @InjectConnection() connection: Connection,
  ) {
    super(friendshipInvitationModel, connection);
  }
}
