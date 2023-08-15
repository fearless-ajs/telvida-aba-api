import mongoose, { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type CommunityInvitationDocument = HydratedDocument<CommunityInvitation>;

@Schema({ versionKey: false })
export class CommunityInvitation {
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
  receiverId: string;

  @Prop({
    required: true,
    default: 'pending',
  })
  status: string; // Pending, accepted, declined
}

export const CommunityInvitationSchema =
  SchemaFactory.createForClass(CommunityInvitation);
