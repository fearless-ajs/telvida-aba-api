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
  HttpStatus, UploadedFile, ParseFilePipe, Req
} from "@nestjs/common";
import { SupportService } from '../../services/support/support.service';
import { CreateSupportDto } from '../../dto/support/create-support.dto';
import { UpdateSupportDto } from '../../dto/support/update-support.dto';
import ResponseController, { IResponseWithData, IResponseWithMessage } from "@libs/helpers/response-controller";
import { FileInterceptor } from "@nestjs/platform-express";
import { extname } from "path";
import { diskStorage } from "multer";
import { GetCurrentUserId } from "@libs/decorators";
import { Request } from "express";
import { UpdateSupportStatusDto } from "@app/v1/REST/dto/support/update-support-status.dto";

const allowedFileTypes = ['.jpeg', '.jpg', '.png', '.gif', '.pdf', '.docx', '.doc', '.mp3', '.wav', '.mp4'];
const maxFileSize = 100000000; // 100MB in bytes

@Controller('supports')
export class SupportController extends ResponseController{
  constructor(private readonly supportService: SupportService) {
    super();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(
    FileInterceptor('attachment', {
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
        destination: './uploads/attachments',
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
  async create(@Body() createSupportDto: CreateSupportDto, @GetCurrentUserId() userId: string,
               @UploadedFile(
                 new ParseFilePipe({
                   fileIsRequired: false
                 }),
               ) file: Express.Multer.File): Promise<IResponseWithData> {
    createSupportDto.attachment =  file? file.path:null;
    const response_data = await this.supportService.create(createSupportDto, userId);
    return this.responseWithData(response_data);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Req() req: Request) {
    const response_data = await this.supportService.findAll(req);
    return this.responseWithDataCollection(response_data);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string): Promise<IResponseWithData>  {
    const response_data = await this.supportService.findOne(id);
    return this.responseWithData(response_data);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.ACCEPTED)
  @UseInterceptors(
    FileInterceptor('attachment', {
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
        destination: './uploads/attachments',
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
  async update(@Param('id') id: string, @Body() updateSupportDto: UpdateSupportDto, @GetCurrentUserId() userId: string,
         @UploadedFile(
           new ParseFilePipe({
             fileIsRequired: false
           }),
         ) file: Express.Multer.File): Promise<IResponseWithData> {
    updateSupportDto.attachment =  file? file.path:null;
    const response_data = await this.supportService.update(id, userId, updateSupportDto);
    return this.responseWithData(response_data);
  }


  @Patch('update-status/:id')
  @HttpCode(HttpStatus.ACCEPTED)
  async updateStatus(@Param('id') id: string, @Body() updateSupportStatusDto: UpdateSupportStatusDto, @GetCurrentUserId() userId: string): Promise<IResponseWithData> {
    const response_data = await this.supportService.updateStatus(id, userId, updateSupportStatusDto);
    return this.responseWithData(response_data);
  }


  @Delete(':id')
  @HttpCode(HttpStatus.ACCEPTED)
  async remove(@Param('id') id: string, @GetCurrentUserId() userId: string): Promise<IResponseWithMessage> {
    await this.supportService.remove(id, userId);
    return this.responseMessage('Support deleted');
  }
}
