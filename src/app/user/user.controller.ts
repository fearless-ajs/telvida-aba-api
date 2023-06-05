import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe, MaxFileSizeValidator, FileTypeValidator, Res, Req, UseGuards, SetMetadata, HttpCode, HttpStatus
} from "@nestjs/common";
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {FileInterceptor} from "@nestjs/platform-express";
import {diskStorage} from "multer";
import {extname} from "path";
import { Request } from "express";
import ResponseController, {
  IResponseWithData,
  IResponseWithDataCollection,
  IResponseWithMessage
} from "@libs/helpers/response-controller";
import JwtAuthGuard from "../auth/guards/jwt-auth.guard";
import {User} from "./entities/user.entity";
import { AccessTokenPermission, Guest } from "@libs/decorators";
import { CurrentUser } from "@libs/decorators/current-user.decorator";

@Controller('users')
export class UserController extends ResponseController{
  constructor(private readonly userService: UserService) {
    super();
  }

  @Post()
  @Guest()
  @AccessTokenPermission('create-user')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(
      FileInterceptor('image',  {
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
      })
  )

  async create(@Body() createUserDto: CreateUserDto,  @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 100000 }),
          new FileTypeValidator({ fileType: 'image/jpeg' }),
        ],
        fileIsRequired: false
      }),
  ) file: Express.Multer.File): Promise<IResponseWithData> {
    // @ts-ignore
    createUserDto.image =  file? file.path:null;
    const response_data = await this.userService.create(createUserDto);
    // @ts-ignore
    const { _id,
      email,
      image,
    } = response_data;

    return this.responseWithData({
      _id,
      email,
      image,
    });
  }

  @Get()
  @AccessTokenPermission('read-user')
  @HttpCode(HttpStatus.OK)
  async findAll(@Req() req: Request):Promise<IResponseWithDataCollection> {
    const response_data = await this.userService.findAll(req);
    return this.responseWithDataCollection(response_data);
  }

  @Get(':id')
  @AccessTokenPermission('read-user')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string): Promise<IResponseWithData> {
    const response_data = await this.userService.findOne(id);
    return this.responseWithData(response_data);
  }


  @Patch(':id')
  @AccessTokenPermission('edit-user')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(
      FileInterceptor('image',  {
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
      })
  )
  async update(@Param('id') id: string, @CurrentUser() user: User, @Body() updateUserDto: UpdateUserDto,  @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 100000 }),
          new FileTypeValidator({ fileType: 'image/jpeg' }),
        ],
        fileIsRequired: false
      }),
  ) file: Express.Multer.File): Promise<IResponseWithData> {

    updateUserDto.image =  file?file.path:null;
    const response_data = await this.userService.update(id, user, updateUserDto);
    return this.responseWithData(response_data);
  }

  @Delete(':id')
  @AccessTokenPermission('delete-user')
  @HttpCode(HttpStatus.ACCEPTED)
  async remove(@Param('id') id: string, @CurrentUser() user: User): Promise<IResponseWithMessage> {
    await this.userService.remove(id, user);
    return this.responseMessage('User deleted');
  }
}
