import mongoose, { HydratedDocument } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { AbstractDocument } from "@libs/database/abstract.entity";

export type ConversationDocument = HydratedDocument<Conversation>;

@Schema({ versionKey: false })
export class Conversation extends AbstractDocument{
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Friendship',
    required: true,
  })
  friendship_id: string;

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
    required: false
  })
  message?: string;

  @Prop({
    required: true,
    default: 'sent' // sent, delivered, read
  })
  status?: string;

  @Prop({
    required: false,
    default: false
  })
  deleteForReceiver?: boolean;

  @Prop({
    required: false,
    default: false
  })
  deleteForSender?: boolean;

  @Prop({
    required: false,
    default: false
  })
  deleteForEveryone?: boolean;

  attachments?: any[];
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);
