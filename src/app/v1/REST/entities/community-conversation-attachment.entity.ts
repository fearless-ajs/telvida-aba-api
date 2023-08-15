import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type CommunityConversationAttachmentDocument =
  HydratedDocument<CommunityConversationAttachment>;

@Schema({ versionKey: false })
export class CommunityConversationAttachment {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CommunityConversation',
    required: true,
  })
  communityConversationId: string;

  @Prop({
    required: true,
    type: String,
  })
  path: string;

  @Prop({
    required: true,
    type: String,
  })
  originalName: string;

  @Prop({
    required: false,
    type: String,
  })
  size?: string;

  @Prop({
    required: false,
    type: String,
  })
  encoding?: string;

  @Prop({
    required: false,
    type: String,
  })
  mimetype?: string;

  @Prop({
    required: true,
    type: String,
    default: 'active',
  })
  status: string; // active or deleted
}
export const CommunityConversationAttachmentSchema =
  SchemaFactory.createForClass(CommunityConversationAttachment);
