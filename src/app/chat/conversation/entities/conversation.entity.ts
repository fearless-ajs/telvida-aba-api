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
    required: true
  })
  message: string;

  @Prop({
    required: true,
    default: 'sent' // sent, delivered, read
  })
  status: string;

}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);
