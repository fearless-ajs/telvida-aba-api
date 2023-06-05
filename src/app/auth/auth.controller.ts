import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from "@nestjs/common";
import {Ctx, MessagePattern, NatsContext, Payload} from '@nestjs/microservices';
import {AuthService} from './auth.service';
import {User} from "../user/entities/user.entity";
import ResponseController, { IResponseWithData, IResponseWithMessage } from "@libs/helpers/response-controller";
import {VerifyTokenDto} from "./dto/verify-token.dto";
import {ResendTokenDto} from "./dto/resed-token.dto";
import {ForgotPasswordDto} from "./dto/forgot-password.dto";
import {ResetPasswordTokenDto} from "./dto/reset-password-token.dto";
import { CreateUserDto } from "../user/dto/create-user.dto";
import { GetCurrentUser, GetCurrentUserId, Guest } from "@libs/decorators";
import { CurrentUser } from "@libs/decorators/current-user.decorator";
import { SignInDto } from "@app/auth/dto/sign-in.dto";
import { RefreshTokenGuard } from "@libs/Guards/refresh-jwt/refresh-jwt.guard";

@Controller()
export class AuthController extends ResponseController{
  constructor(private readonly authService: AuthService) {
    super();
  }

  @Guest()
  @Post('sign-up')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() createUserDto: CreateUserDto): Promise<IResponseWithData> {
    const response_data = await this.authService.register(createUserDto);
    delete response_data.password;
    delete response_data.emailVerificationToken;
    return this.responseWithData(response_data);
  }


  @Guest()
  @Post('sign-in')
  @HttpCode(HttpStatus.ACCEPTED)
  async login(@Body() signInDto: SignInDto): Promise<IResponseWithData> {
    const response_data = await this.authService.login(signInDto);
    const { user, access_token, refresh_token } = response_data;
    return this.responseWithData({
      access_token,
      refresh_token,
      user: user
    });
  }

  @Guest()
  @UseGuards(RefreshTokenGuard)
  @Post('refresh-access-tokens')
  @HttpCode(HttpStatus.ACCEPTED)
  async refreshToken(@GetCurrentUserId() userId: string, @GetCurrentUser('refreshToken') refreshToken: string): Promise<IResponseWithData> {
    const response_data = await this.authService.refreshTokens(userId, refreshToken);
    const { user, access_token, refresh_token } = response_data;
    return this.responseWithData({
      access_token,
      refresh_token,
      user: user
    });
  }

  @Guest()
  @Post('verify-token')
  @HttpCode(HttpStatus.OK)
  async verifyToken(@Body() verifyTokenDto: VerifyTokenDto): Promise<IResponseWithData> {
    const response_data = await this.authService.verifyToken(verifyTokenDto.token);
    return this.responseWithData( response_data);
  }

  @Guest()
  @Post('resend-token')
  @HttpCode(HttpStatus.OK)
  async resendToken(@Body() resendTokenDto: ResendTokenDto): Promise<IResponseWithMessage> {
    await this.authService.resendToken(resendTokenDto.email);
    return this.responseMessage('Token resent.');
  }

  @Guest()
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto): Promise<IResponseWithMessage> {
    await this.authService.forgotPassword(forgotPasswordDto.email);
    return this.responseMessage('Reset Token sent.');
  }

  @Guest()
  @Post('verify-password-reset-token')
  @HttpCode(HttpStatus.OK)
  async verifyPasswordResetPassword(@Body() verifyTokenDto: VerifyTokenDto): Promise<IResponseWithMessage> {
    await this.authService.verifyResetPasswordToken(verifyTokenDto.token);
    return this.responseMessage('Password reset Token valid');
  }


  @Guest()
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() resetPasswordTokenDto: ResetPasswordTokenDto): Promise<IResponseWithMessage> {
    await this.authService.resetPassword(resetPasswordTokenDto);
    return this.responseMessage('Password reset successfully.');
  }

  @Post('sign-out')
  @HttpCode(HttpStatus.OK)
  async logout(@CurrentUser() user: User): Promise<IResponseWithMessage> {
    await this.authService.logout(user);
    return this.responseMessage('Logged out user successfully.');
  }

}
