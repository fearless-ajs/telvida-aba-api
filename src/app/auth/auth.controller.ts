import {
  Body,
  Controller,
  Delete, FileTypeValidator,
  Get,
  HttpCode,
  HttpStatus, MaxFileSizeValidator,
  Param, ParseFilePipe,
  Post, UploadedFile,
  UseGuards,
  UseInterceptors
} from "@nestjs/common";
import {Ctx, MessagePattern, NatsContext, Payload} from '@nestjs/microservices';
import {AuthService} from './auth.service';
import {User} from "../user/entities/user.entity";
import ResponseController, { IResponseWithData, IResponseWithMessage } from "@libs/helpers/response-controller";
import {VerifyTokenDto} from "./dto/verify-token.dto";
import {ResendTokenDto} from "./dto/resed-token.dto";
import {ForgotPasswordDto} from "./dto/forgot-password.dto";
import {ResetPasswordTokenDto} from "./dto/reset-password-token.dto";
import { CreateUserDto } from "../user/dto/create-user.dto";
import { AccessTokenPermission, GetCurrentUser, GetCurrentUserId, Guest } from "@libs/decorators";
import { CurrentUser } from "@libs/decorators/current-user.decorator";
import { SignInDto } from "@app/auth/dto/sign-in.dto";
import { RefreshTokenGuard } from "@libs/Guards/refresh-jwt/refresh-jwt.guard";
import { ConfigService } from "@nestjs/config";
import { TJwtPayload } from "@libs/types";
import { UpdateUserDto } from "@app/user/dto/update-user.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { extname } from "path";
import { FileUploadInterceptor } from "@libs/interceptors/file-upload.interceptor";

const allowedFileTypes = ['.jpeg', '.jpg', '.png', '.gif', '.pdf', '.docx', '.doc', '.mp3', '.wav', '.mp4'];
const maxFileSize = 100000000; // 100MB in bytes

@Controller()
export class AuthController extends ResponseController{
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService
  ) {
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
      "access-token": access_token,
      "refresh-token": refresh_token,
      "type": "Bearer",
      "access-token-life-span": this.configService.get<string>('JWT_AUTH_TOKEN_EXPIRATION'),
      "refresh-token-life-span": this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRATION'),
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
    const { user, access_token, refresh_token } = response_data;
    return this.responseWithData({
      "access-token": access_token,
      "refresh-token": refresh_token,
      "type": "Bearer",
      "access-token-life-span": this.configService.get<string>('JWT_AUTH_TOKEN_EXPIRATION'),
      "refresh-token-life-span": this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRATION'),
      user: user
    });
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

  @Get('my-profile')
  @HttpCode(HttpStatus.ACCEPTED)
  async myProfile(@CurrentUser() user: TJwtPayload): Promise<IResponseWithData> {
    const response_data = await this.authService.myProfile(user.userId);
    return this.responseWithData(response_data);
  }

  @Post('update-my-profile')
  @HttpCode(HttpStatus.ACCEPTED)
  @UseInterceptors(
    FileInterceptor('image', {
      limits: {
        fileSize: maxFileSize
      },
      storage: diskStorage({
        destination: './uploads/images',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const filename = `${uniqueSuffix}${ext}`;
          callback(null, filename);
        },
      }),
    }),
  )
  async updateMyProfile(@Body() updateUserDto: UpdateUserDto, @GetCurrentUserId() userId: string,
                        @UploadedFile(
                          new ParseFilePipe({
                            validators: [
                              new MaxFileSizeValidator({ maxSize: maxFileSize }),
                              new FileTypeValidator({ fileType: 'image/jpeg' }),
                            ],
                            fileIsRequired: false,
                          }),
                        ) file: Express.Multer.File,
  ): Promise<IResponseWithData> {
    updateUserDto.image =  file? file.path:null;

    const response_data = await this.authService.updateMyProfile(updateUserDto, userId);
    return this.responseWithData(response_data);
  }


  @Post('update-my-profile-with-identity-proof')
  @HttpCode(HttpStatus.ACCEPTED)
  @UseInterceptors(
    FileInterceptor('identity_proof', {
      fileFilter: (req, file, callback) => {
        const ext = extname(file.originalname).toLowerCase();
        if (allowedFileTypes.includes(ext)) {
          callback(null, true);
        } else {
          callback(new Error('Invalid file type.'), false);
        }
      },
      limits: {
        fileSize: maxFileSize
      },
      storage: diskStorage({
        destination: './uploads/identities',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const filename = `${uniqueSuffix}${ext}`;
          callback(null, filename);
        },
      }),
    }),
  )
  async updateMyIdentityProof(@Body() updateUserDto: UpdateUserDto, @GetCurrentUserId() userId: string,
                              @UploadedFile(
                                new ParseFilePipe({
                                  fileIsRequired: false
                                }),
                              ) file: Express.Multer.File): Promise<IResponseWithData> {
    updateUserDto.identity_proof =  file? file.path:null;
    const response_data = await this.authService.updateMyProfile(updateUserDto, userId);
    return this.responseWithData(response_data);
  }

  @Delete('delete-my-profile')
  @HttpCode(HttpStatus.ACCEPTED)
  async removeMyProfile(@CurrentUser() user: TJwtPayload): Promise<IResponseWithMessage> {
    await this.authService.removeMyProfile(user.userId);
    return this.responseMessage('Profile deleted');
  }


}
