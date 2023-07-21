import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UseInterceptors, UploadedFile, ParseFilePipe, Req
} from "@nestjs/common";
import { ResourceService } from './resource.service';
import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';
import ResponseController, {
  IResponseWithData,
  IResponseWithMessage
} from "@libs/helpers/response-controller";
import { GetCurrentUserId } from "@libs/decorators";
import { diskStorage } from "multer";
import { extname } from "path";
import { Request } from "express";
import { FileInterceptor } from "@nestjs/platform-express";


const allowedFileTypes = ['.jpeg', '.jpg', '.png', '.gif', '.pdf', '.docx', '.doc', '.mp3', '.wav', '.mp4'];
const maxFileSize = 100000000; // 100MB in bytes


@Controller('resources')
export class ResourceController extends ResponseController{
  constructor(private readonly resourceService: ResourceService) {
    super();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(
    FileInterceptor('resource_file', {
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
        destination: './uploads/resources',
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
  async create(@Body() createResourceDto: CreateResourceDto, @GetCurrentUserId() userId: string,
                              @UploadedFile(
                                new ParseFilePipe({
                                  fileIsRequired: true
                                }),
                              ) file: Express.Multer.File): Promise<IResponseWithData> {
    createResourceDto.resource_file =  file? file.path:null;
    const response_data = await this.resourceService.create(createResourceDto, userId);
    return this.responseWithData(response_data);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Req() req: Request) {
    const response_data = await this.resourceService.findAll(req);
    const {length, data} = response_data;

    return this.responseWithCollection(data, length);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string): Promise<IResponseWithData>  {
    const response_data = await this.resourceService.findOne(id);
    return this.responseWithData(response_data);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.ACCEPTED)
  @UseInterceptors(
    FileInterceptor('resource_file', {
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
        destination: './uploads/resources',
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
  async update(@Param('id') id: string, @GetCurrentUserId() userId: string, @Body() updateResourceDto: UpdateResourceDto,
               @UploadedFile(
                new ParseFilePipe({
                  fileIsRequired: false
                }),
  ) file: Express.Multer.File): Promise<IResponseWithData> {
    updateResourceDto.resource_file =  file? file.path:null;
    const response_data = await this.resourceService.update(id,userId, updateResourceDto);
    return this.responseWithData(response_data);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @GetCurrentUserId() userId: string): Promise<IResponseWithMessage> {
    await this.resourceService.remove(id, userId);
    return this.responseMessage('Resource deleted');
  }
}
