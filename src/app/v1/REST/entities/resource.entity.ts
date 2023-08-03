import mongoose, { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from '@libs/database/abstract.entity';

export type ResourceDocument = HydratedDocument<Resource>;

@Schema({ versionKey: false })
export class Resource extends AbstractDocument {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user_id: string;

  @Prop({
    required: false,
  })
  name?: string;

  @Prop({
    required: false,
  })
  description: string;

  @Prop({
    required: true,
  })
  resource_file: string;

  @Prop({
    required: false,
  })
  location?: string;

  @Prop({
    required: false,
  })
  country?: string;

  @Prop({
    required: false,
  })
  state?: string;

  @Prop({
    required: false,
  })
  zone?: string;
}
export const ResourceSchema = SchemaFactory.createForClass(Resource);
