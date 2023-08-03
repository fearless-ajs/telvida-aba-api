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
  Req,
} from '@nestjs/common';
import { EventService } from '../../services/event/event.service';
import { CreateEventDto } from '../../dto/event/create-event.dto';
import { UpdateEventDto } from '../../dto/event/update-event.dto';
import ResponseController, {
  IResponseWithData,
  IResponseWithDataCollection,
  IResponseWithMessage,
} from '@libs/helpers/response-controller';
import { GetCurrentUserId } from '@libs/decorators';
import { Request } from 'express';

@Controller('events')
export class EventController extends ResponseController {
  constructor(private readonly eventService: EventService) {
    super();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createEventDto: CreateEventDto,
    @GetCurrentUserId() userId: string,
  ): Promise<IResponseWithData> {
    const response_data = await this.eventService.create(
      createEventDto,
      userId,
    );
    return this.responseWithData(response_data);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Req() req: Request): Promise<IResponseWithDataCollection> {
    const response_data = await this.eventService.findAll(req);
    return this.responseWithDataCollection(response_data);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string): Promise<IResponseWithData> {
    const response_data = await this.eventService.findOne(id);
    return this.responseWithData(response_data);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.ACCEPTED)
  async update(
    @Param('id') id: string,
    @GetCurrentUserId() userId: string,
    @Body() updateEventDto: UpdateEventDto,
  ): Promise<IResponseWithData> {
    const response_data = await this.eventService.update(
      id,
      userId,
      updateEventDto,
    );
    return this.responseWithData(response_data);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(
    @Param('id') id: string,
    @GetCurrentUserId() userId: string,
  ): Promise<IResponseWithMessage> {
    await this.eventService.remove(id, userId);
    return this.responseMessage('Event deleted');
  }
}
