import mongoose, { HydratedDocument } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { AbstractDocument } from "@libs/database/abstract.entity";

export type SupportDocument = HydratedDocument<Support>;

@Schema({ versionKey: false })
export class Support extends AbstractDocument{
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user_id: string;

  @Prop({
    required: true,
  })
  reference_id: string;

  @Prop({
    required: true,
  })
  title: string;

  @Prop({
    required: true,
  })
  description: string;

  @Prop({
    required: true,
  })
  status: string;

  @Prop({
    required: false,
  })
  attachment?: string;
}

export const SupportSchema = SchemaFactory.createForClass(Support);
