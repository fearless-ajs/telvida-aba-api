import { AbstractDocument } from '@libs/database/abstract.entity';
import mongoose, { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type FriendshipDocument = HydratedDocument<Friendship>;

@Schema({ versionKey: false })
export class Friendship extends AbstractDocument {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  initiator_id: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  receiver_id: string;
}

export const FriendshipSchema = SchemaFactory.createForClass(Friendship);
