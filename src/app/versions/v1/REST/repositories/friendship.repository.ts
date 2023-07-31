import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import { AbstractRepository } from "@libs/database/abstract.repository";
import { Friendship } from "@app/versions/v1/REST/entities/friendship.entity";

@Injectable()
export class FriendshipRepository extends AbstractRepository<Friendship> {
  protected readonly logger = new Logger(Friendship.name);

  constructor(
    @InjectModel(Friendship.name) friendshipModel: Model<Friendship>,
    @InjectConnection() connection: Connection,
  ) {
    super(friendshipModel, connection);
  }
}
