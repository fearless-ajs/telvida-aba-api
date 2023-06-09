import { ForbiddenException, Injectable, NotAcceptableException, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { User } from "../user/entities/user.entity";
import { CreateUserDto } from "../user/dto/create-user.dto";
import { UserService } from "../user/user.service";
import * as bcrypt from "bcrypt";
import { randomInt } from "crypto";
import { ResetPasswordTokenDto } from "./dto/reset-password-token.dto";
import { TJwtPayload, TTokens } from "@libs/types/auth";
import * as argon from "argon2";
import { SignInDto } from "@app/auth/dto/sign-in.dto";
import { AuthEmailService } from "@libs/mail/auth-email/auth-email.service";
import { string } from "joi";
import { UpdateUserDto } from "@app/user/dto/update-user.dto";

export interface TokenPayload {
  userId: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly authEmailService: AuthEmailService
  ) {}

  async login(signInDto: SignInDto):  Promise<TTokens> {
    const { email, password } = signInDto;
    const user = await this.userService.validateUser(email, password);

    const tokens = await this.getTokens(user._id.toString(), user.email);

    const new_user = await this.updateRefreshTokenHash(user._id.toString(), tokens.refresh_token);

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

    const [at, rt] = await Promise.all([
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
      access_token: at,
      refresh_token: rt,
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

    // Send the token to the user email
    await this.authEmailService.resendVerificationTokenMessage(user);

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

    await this.authEmailService.sendForgotPasswordMessage(user, code);
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

    await this.authEmailService.sendPasswordUpdatedMessage(updated_user)
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


  async verifyToken(token: string): Promise<User> {
    // Verify the token supplied
    const user = await this.userService.checkUserVerificationToken(token);

    if (!user){
      throw new NotAcceptableException('Invalid token');
    }

    // @ts-ignore
    const user_details =  await this.userService.findOneByIdAndUpdate(user._id, {
      emailVerificationStatus: true,
      emailVerificationToken: null,
      emailVerifiedAt: Date.now(),
      updatedAt: Date.now()
    });

    // Send verification email to user
    await this.authEmailService.sendAccountVerificationMessage(user_details);
    return user_details
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

}
