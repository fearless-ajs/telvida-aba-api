import mongoose, { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from '@libs/database/abstract.entity';

export type FriendshipInvitationDocument =
  HydratedDocument<FriendshipInvitation>;

@Schema({ versionKey: false })
export class FriendshipInvitation extends AbstractDocument {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  sender_id: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  receiver_id: string;

  @Prop({
    required: true,
  })
  status: string; // Pending, accepted, declined
}

export const FriendshipInvitationSchema =
  SchemaFactory.createForClass(FriendshipInvitation);
