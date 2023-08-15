import mongoose, { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type CommunityConversationDocument =
  HydratedDocument<CommunityConversation>;

@Schema({ versionKey: false })
export class CommunityConversation {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Community',
    required: true,
  })
  communityId: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  senderId: string;

  @Prop({
    type: String,
    required: false,
  })
  message?: string;

  @Prop({
    type: String,
    required: false,
    default: 'sent',
  })
  status: string; // sent, delivered, read

  @Prop({
    required: false,
    default: false,
  })
  deleteForReceiver?: boolean;

  @Prop({
    required: false,
    default: false,
  })
  deleteForSender?: boolean;

  @Prop({
    required: false,
    default: false,
  })
  deleteForEveryone?: boolean;

  attachments?: any[];
}

export const CommunityConversationSchema = SchemaFactory.createForClass(
  CommunityConversation,
);
