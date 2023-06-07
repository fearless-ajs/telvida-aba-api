import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import mongoose, {HydratedDocument} from "mongoose";
import {User} from "@app/user/entities/user.entity";
import {AbstractDocument} from "@libs/database/abstract.entity";

export type AccessTokenDocument = HydratedDocument<AccessToken>;


@Schema({ versionKey: false })
export class AccessToken extends AbstractDocument{
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    user_id: string;

    @Prop({
        required: true,
        unique: true
    })
    name: string;

    @Prop({
        required: true,
        unique: true
    })
    token: string;

    @Prop({
        type: Date,
        required: true,
    })
    expiry_date: Date;

}

export const AccessTokenSchema = SchemaFactory.createForClass(AccessToken);
