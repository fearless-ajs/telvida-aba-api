import {HydratedDocument} from "mongoose";
import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {AbstractDocument} from "@libs/database/abstract.entity";
import { Exclude } from "class-transformer";

export type UserDocument = HydratedDocument<User>;

@Schema({ versionKey: false })
export class User  extends AbstractDocument{
    @Prop({
        required: false
    })
    fullname?: string;

    @Prop({
        required: false
    })
    username?: string;

    @Prop({
        required: true,
        unique: true
    })
    email: string

    @Prop({
        required: false
    })
    phone?: string

    @Prop({
        required: false
    })
    image?: string

    @Exclude()
    @Prop({
        select: false
    })
    password: string;

    @Prop({
        required: false,
        select: false
    })
    passwordResetToken?: String;

    @Prop({
        required: false,
        select: false
    })
    emailVerificationToken?: string

    @Prop({
        required: false,
    })
    emailVerifiedAt?: Date

    @Prop({
        default: false,
        required: false,
    })
    emailVerificationStatus?: boolean

    @Prop({
        required: false
    })
    passwordResetExpires?: Date;

    @Prop({
        required: false,
        select: false
    })
    refreshToken?: string // Hashed version of the refresh token

}


export const UserSchema = SchemaFactory.createForClass(User);
