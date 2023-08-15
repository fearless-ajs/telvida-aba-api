import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  HttpCode,
  HttpStatus,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  Req,
} from '@nestjs/common';
import { CommunityService } from '../../../services/group/community/community.service';
import { CreateCommunityDto } from '../../../dto/group/community/create-community.dto';
import { UpdateCommunityDto } from '../../../dto/group/community/update-community.dto';
import { GetCurrentUserId } from '@libs/decorators';
import ResponseController, {
  IResponseWithData,
  IResponseWithDataCollection,
  IResponseWithMessage,
} from '@libs/helpers/response-controller';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Request } from 'express';

@Controller('communities')
export class CommunityController extends ResponseController {
  constructor(private readonly communityService: CommunityService) {
    super();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(
    FileInterceptor('image', {
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
  async create(
    @Body() createCommunityDto: CreateCommunityDto,
    @GetCurrentUserId() userId: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 100000 }),
          new FileTypeValidator({ fileType: 'image/jpeg' }),
        ],
        fileIsRequired: false,
      }),
    )
    file: Express.Multer.File,
  ): Promise<IResponseWithData> {
    createCommunityDto.image = file ? file.path : null;
    const response_data = await this.communityService.create(
      createCommunityDto,
      userId,
    );
    return this.responseWithData(response_data);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Req() req: Request): Promise<IResponseWithDataCollection> {
    const response_data = await this.communityService.findAll(req);
    return this.responseWithDataCollection(response_data);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string): Promise<IResponseWithData> {
    const response_data = await this.communityService.findOne(id);
    return this.responseWithData(response_data);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.ACCEPTED)
  @UseInterceptors(
    FileInterceptor('image', {
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
  async update(
    @Param('id') id: string,
    @Body() updateCommunityDto: UpdateCommunityDto,
    @GetCurrentUserId() userId: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 100000 }),
          new FileTypeValidator({ fileType: 'image/jpeg' }),
        ],
        fileIsRequired: false,
      }),
    )
    file: Express.Multer.File,
  ): Promise<IResponseWithData> {
    updateCommunityDto.image = file ? file.path : null;
    const response_data = await this.communityService.update(
      id,
      userId,
      updateCommunityDto,
    );
    return this.responseWithData(response_data);
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @GetCurrentUserId() userId: string,
  ): Promise<IResponseWithMessage> {
    await this.communityService.remove({ userId, communityId: id });
    return this.responseMessage('Community deleted');
  }

}
