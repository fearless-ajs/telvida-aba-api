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
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  Req,
  HttpCode,
  HttpStatus
} from "@nestjs/common";
import { UserService } from '../../services/user/user.service';
import { CreateUserDto } from '../../dto/user/create-user.dto';
import { UpdateUserDto } from '../../dto/user/update-user.dto';
import {FileInterceptor} from "@nestjs/platform-express";
import {diskStorage} from "multer";
import {extname} from "path";
import { Request } from "express";
import ResponseController, {
  IResponseWithData,
  IResponseWithDataCollection,
  IResponseWithMessage
} from "@libs/helpers/response-controller";
import { AccessTokenPermission, Guest } from "@libs/decorators";

@Controller('users')
export class UserController extends ResponseController{
  constructor(private readonly userService: UserService) {
    super();
  }

  @Post()
  @Guest()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUserDto): Promise<IResponseWithData> {
    const response_data = await this.userService.create(createUserDto);
    delete response_data.password;
    delete response_data.emailVerificationToken;
    return this.responseWithData(response_data);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Req() req: Request):Promise<IResponseWithDataCollection> {
    const response_data = await this.userService.findAll(req);
    return this.responseWithDataCollection(response_data);
  }

  @Get(':id')
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
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto,  @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 100000 }),
          new FileTypeValidator({ fileType: 'image/jpeg' }),
        ],
        fileIsRequired: false
      }),
  ) file: Express.Multer.File): Promise<IResponseWithData> {
    updateUserDto.image =  file?file.path:null;
    const response_data = await this.userService.update(id, updateUserDto);
    return this.responseWithData(response_data);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.ACCEPTED)
  async remove(@Param('id') id: string): Promise<IResponseWithMessage> {
    await this.userService.remove(id);
    return this.responseMessage('User deleted');
  }

}
