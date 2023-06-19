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
    firstname?: string;

    @Prop({
        required: false
    })
    lastname?: string;

    @Prop({
        required: false
    })
    username?: string;

    @Prop({
        required: false
    })
    location?: string;


    @Prop({
        required: false
    })
    role?: string


    @Prop({
        required: false
    })
    identity_proof?: string

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

    @Prop({
        required: false
    })
    bio?: string

    @Prop({
        required: false,
        default: 'active'
    })
    status?: string

    @Prop({
        required: false
    })
    displayName?: string


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
