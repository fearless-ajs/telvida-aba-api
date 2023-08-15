import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from '@libs/database/abstract.entity';

export type CommunityDocument = HydratedDocument<Community>;

@Schema({ versionKey: false })
export class Community extends AbstractDocument {
  @Prop({
    type: String,
    required: true,
  })
  name: string;

  @Prop({
    type: String,
    required: false,
  })
  image?: string;

  @Prop({
    type: String,
    required: false,
  })
  location?: string; // lat long

  @Prop({
    type: String,
    required: false,
  })
  description?: string;
}

export const CommunitySchema = SchemaFactory.createForClass(Community);
