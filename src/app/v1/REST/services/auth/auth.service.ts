import { ForbiddenException, Injectable, NotAcceptableException, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { User } from "../../entities/user.entity";
import { CreateUserDto } from "../../dto/user/create-user.dto";
import { UserService } from "../user/user.service";
import * as bcrypt from "bcrypt";
import { randomInt } from "crypto";
import { ResetPasswordTokenDto } from "../../dto/auth/reset-password-token.dto";
import { TJwtPayload, TTokens } from "@libs/types/auth";
import * as argon from "argon2";
import { SignInDto } from "@app/v1/REST/dto/auth/sign-in.dto";
import { UpdateUserDto } from "@app/v1/REST/dto/user/update-user.dto";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { events } from "@config/constants";
import { UserEvent } from "@app/v1/REST/events/user/user.event";
import { ForgotPasswordEvent } from "@app/v1/REST/events/auth/forgot-password.event";
import { UserLoggedInEvent } from "@app/v1/REST/events/auth/user-logged-in.event";

export interface TokenPayload {
  userId: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async login(signInDto: SignInDto):  Promise<TTokens> {
    const { email, password } = signInDto;
    const user = await this.userService.validateUser(email, password);

    const tokens = await this.getTokens(user._id.toString(), user.email);

    const new_user = await this.updateRefreshTokenHash(user._id.toString(), tokens.refresh_token);

    // Dispatch user logged in event
    this.eventEmitter.emit(events.USER_LOGGED_IN, new UserLoggedInEvent(user));

    return {
      ...tokens,
      user: new_user
    };
  }

  async updateRefreshTokenHash(userId: string, refresh_token: string): Promise<User> {
    const hash = await argon.hash(refresh_token);
    return await this.userService.findOneByIdAndUpdate(userId, {
     refreshToken: hash
   });
  }

  async getTokens(userId: string, email: string): Promise<TTokens> {
    const jwtPayload: TJwtPayload = {
      userId: userId,
      email: email,
    };

    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: `${this.configService.get('JWT_AUTH_TOKEN_EXPIRATION')}`,
      }),
      this.jwtService.signAsync(jwtPayload, {
        secret: this.configService.get<string>('REFRESH_JWT_SECRET'),
        expiresIn: `${this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRATION')}`,
      }),
    ]);

    return {
      access_token,
      refresh_token,
    };
  }

  async refreshTokens(userId: string, refreshToken: string): Promise<TTokens> {
    const user = await this.userService.findOneByFilterWithRefreshToken({ _id: userId});

    if (!user || !user.refreshToken) throw new ForbiddenException('Access Denied');

    const refreshTokenMatches  = await argon.verify(user.refreshToken, refreshToken);

    if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');

    const tokens = await this.getTokens(user._id.toString(), user.email);
    const new_user = await this.updateRefreshTokenHash(user._id.toString(), tokens.refresh_token);

    return {
      ...tokens,
      user: new_user
    };
  }


  private static tokenExpired(token: string) {
    const expiry = (JSON.parse(atob(token.split('.')[1]))).exp;
    return (Math.floor((new Date).getTime() / 1000)) >= expiry;
  }


  async register(createUserDto: CreateUserDto): Promise<any> {
    // send token and account name to user

    return await this.userService.create(createUserDto);
  }

  async resendToken(email: string): Promise<Boolean> {

    // Verify the token supplied
    const user = await this.userService.findOneByEmail(email);
    if (!user){
      throw new NotFoundException('User not found');
    }

    if (user.emailVerificationStatus){
      throw new NotAcceptableException('User verified already');
    }

    // Emit a resend verification token event
    this.eventEmitter.emit(events.VERIFICATION_TOKEN_REQUEST, new UserEvent(user));

    return true;
  }

  async forgotPassword(email: string): Promise<Boolean> {

    // Verify the token supplied
    const user = await this.userService.findOneByEmail(email);
    if (!user){
      throw new NotFoundException('User not found');
    }

    // create a token
    const code = randomInt(10000000, 999999999);

    // @ts-ignore
    await  this.userService.findOneByIdAndUpdate(user._id, {
      passwordResetToken: code
    });

    // Emit a forgot password event
    this.eventEmitter.emit(events.FORGOT_PASSWORD, new ForgotPasswordEvent(user, code));

    return true;
  }

  async resetPassword(resetPasswordToken: ResetPasswordTokenDto): Promise<Boolean> {
    const { token, new_password } = resetPasswordToken;

    const user = await this.verifyResetPasswordToken(token);

    // @ts-ignore
    const hash = await bcrypt.hash(new_password, 10);

    // @ts-ignore
    const updated_user = await  this.userService.findOneByIdAndUpdate(user._id, {
      password: hash,
      passwordResetToken: null,
      passwordChangedAt: Date.now()
    });

    // Emit a password changed event
    this.eventEmitter.emit(events.PASSWORD_CHANGED, new UserEvent(user));

    return true;
  }

  async verifyResetPasswordToken(token: string): Promise<User> {

    // Verify the token supplied
    const user = await this.userService.checkUserPasswordToken(token);

    if (!user){
      throw new NotAcceptableException('Invalid token');
    }

    return user;
  }


  async verifyToken(token: string): Promise<TTokens> {
    // Verify the token supplied
    const user = await this.userService.checkUserVerificationToken(token);

    if (!user){
      throw new NotAcceptableException('Invalid token');
    }

    // @ts-ignore
    await this.userService.findOneByIdAndUpdate(user._id, {
      emailVerificationStatus: true,
      emailVerificationToken: null,
      emailVerifiedAt: Date.now(),
      updatedAt: Date.now()
    });

    // Emit a user account verification event
    this.eventEmitter.emit(events.ACCOUNT_VERIFIED, new UserEvent(user));

    const tokens = await this.getTokens(user._id.toString(), user.email);

    const new_user = await this.updateRefreshTokenHash(user._id.toString(), tokens.refresh_token);

    return {
      ...tokens,
      user: new_user
    };

  }

  async logout(user: User) {

    // @ts-ignore
    await this.userService.findOneByIdAndUpdate(user._id, {
      refreshToken: null
    });

    // Unset the existing refreshToken, find a way to null the effect.

  }

  async myProfile(userId: string): Promise<User> {
    return this.userService.findOne(userId);
  }

  async updateMyProfile(updateUserDto: UpdateUserDto, userId: string): Promise<User> {
    return this.userService.update(userId, updateUserDto);
  }

  async removeMyProfile(userId: string): Promise<User> {
    return this.userService.remove(userId);
  }

}
