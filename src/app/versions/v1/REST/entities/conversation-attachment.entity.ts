import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { Conversation } from "./conversation.entity";
import { AbstractDocument } from "@libs/database/abstract.entity";

export type ConversationAttachmentDocument = HydratedDocument<ConversationAttachment>;

@Schema({ versionKey: false })
export class ConversationAttachment extends AbstractDocument {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation',
    required: true,
  })
  conversation_id: string;

  @Prop({
    required: true,
    type: String
  })
  path: string;

  @Prop({
    required: true,
    type: String
  })
  originalName: string;

  @Prop({
    required: false,
    type: String
  })
  size?: string;

  @Prop({
    required: false,
    type: String
  })
  encoding?: string;

  @Prop({
    required: false,
    type: String
  })
  mimetype?: string;

  @Prop({
    required: true,
    type: String,
    default: 'active'
  })
  status: string; // active or deleted
}

export const ConversationAttachmentSchema = SchemaFactory.createForClass(ConversationAttachment);
