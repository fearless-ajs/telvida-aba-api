import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  HttpCode, HttpStatus
} from "@nestjs/common";
import { AccessTokenService } from './access-token.service';
import { CreateAccessTokenDto } from './dto/create-access-token.dto';
import { UpdateAccessTokenDto } from './dto/update-access-token.dto';
import { Request } from "express";
import ResponseController, {
  IResponseWithData,
  IResponseWithDataCollection,
  IResponseWithMessage
} from "@libs/helpers/response-controller";
import { User } from "@app/user/entities/user.entity";
import { CurrentUser } from "@libs/decorators/current-user.decorator";
import { GetCurrentUserId } from "@libs/decorators";

@Controller('access-tokens')
export class AccessTokenController extends ResponseController{
  constructor(private readonly accessTokenService: AccessTokenService) {
    super();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createAccessTokenDto: CreateAccessTokenDto, @GetCurrentUserId() userId: string): Promise<IResponseWithData> {
    const response_data = await this.accessTokenService.create(createAccessTokenDto, userId);
    return this.responseWithData(response_data);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Req() req: Request): Promise<IResponseWithDataCollection> {
    const response_data = await this.accessTokenService.findAll(req);
    return this.responseWithDataCollection(response_data);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string): Promise<IResponseWithData>  {
    const response_data = await this.accessTokenService.findOne(id);
    return this.responseWithData(response_data);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
 async update(@Param('id') id: string, @Body() updateAccessTokenDto: UpdateAccessTokenDto): Promise<IResponseWithData> {
    const response_data = await this.accessTokenService.update(id, updateAccessTokenDto);
    return this.responseWithData(response_data);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string): Promise<IResponseWithMessage> {
    await this.accessTokenService.remove(id);
    return this.responseMessage('Access token deleted');
  }

  @Patch('reset-token/:id')
  @HttpCode(HttpStatus.OK)
  async resetToken(@Param('id') id: string): Promise<IResponseWithData>  {
    const response_data = await this.accessTokenService.resetToken(id);
    return this.responseWithData(response_data);
  }
}
