import { Prop, Schema } from '@nestjs/mongoose';
import { SchemaTypes, Types } from 'mongoose';

@Schema()
export class AbstractDocument {
  @Prop({ type: SchemaTypes.ObjectId })
  _id: Types.ObjectId;

  @Prop({
    default: Date.now(),
    required: true
  })
  createdAt: Date;

  @Prop({
    required: true,
    default: Date.now()
  })
  updatedAt: Date;
}
