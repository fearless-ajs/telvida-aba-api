import mongoose, { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from '@libs/database/abstract.entity';

export type CommunityMemberDocument = HydratedDocument<CommunityMember>;

@Schema({ versionKey: false })
export class CommunityMember extends AbstractDocument {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Community',
    required: true,
  })
  communityId: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  userId: string;

  @Prop({
    type: Boolean,
    required: false,
    default: false,
  })
  admin?: boolean;
}

export const CommunityMemberSchema =
  SchemaFactory.createForClass(CommunityMember);
