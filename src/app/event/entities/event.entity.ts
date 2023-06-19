import mongoose, { HydratedDocument } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { AbstractDocument } from "@libs/database/abstract.entity";

export type EventDocument = HydratedDocument<Event>;

@Schema({ versionKey: false })
export class Event extends AbstractDocument{
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user_id: string;

  @Prop({
    required: false
  })
  title: string;

  @Prop({
    type: Date,
    required: true,
  })
  date: string;
}

export const EventSchema = SchemaFactory.createForClass(Event);
