import mongoose, { HydratedDocument } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { AbstractDocument } from "@libs/database/abstract.entity";
import { Event } from "@app/event/entities/event.entity";

export type ResourceDocument = HydratedDocument<Resource>;

@Schema({ versionKey: false })
export class Resource extends AbstractDocument {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user_id: string;

  @Prop({
    required: false
  })
  name?: string;

  @Prop({
    type: String,
    required: true,
  })
  file: string;
}
export const ResourceSchema = SchemaFactory.createForClass(Resource);