import { ConflictException, Injectable, NotAcceptableException, NotFoundException } from "@nestjs/common";
import { CreateEventDto } from '../../dto/event/create-event.dto';
import { UpdateEventDto } from '../../dto/event/update-event.dto';
import { EventRepository } from "@app/versions/v1/REST/repositories/event.repository";
import { Event } from "@app/versions/v1/REST/entities/event.entity";
import { Request } from "express";
import mongoose from "mongoose";
import { IFilterableCollection } from "@libs/helpers/response-controller";

@Injectable()
export class EventService {
  constructor(private readonly eventRepo: EventRepository,) {}

  async create(createEventDto: CreateEventDto, userId: string): Promise<Event>{
    return this.eventRepo.create({
      ...createEventDto,
      user_id: userId
    })
  }

  async findAll(req: Request): Promise<IFilterableCollection> {
    return this.eventRepo.findAllFiltered(req);
  }

  async findOne(id: string): Promise<Event> {
    return this.eventRepo.findById(id);
  }

  async update(id: string, userId: string, updateEventDto: UpdateEventDto): Promise<Event> {
    const existingEvent = await this.eventRepo.documentExist({ _id: id, user_id: userId })
    if (!existingEvent)
      throw new NotFoundException('Event does not exist on user\'s calender');

    // update the event record
    return this.eventRepo.findOneAndUpdate({ _id: id, user_id: userId }, updateEventDto);
  }

  async remove(id: string, userId: string): Promise<Boolean> {
    // check if the id is valid
    if (!mongoose.isValidObjectId(id)){
      throw new NotAcceptableException(`Invalid Event id: ${id}`)
    }

    if (!mongoose.isValidObjectId(userId)){
      throw new NotAcceptableException(`Invalid User id: ${userId}`)
    }

    // Check if the event exists
    const existingEvent = await this.eventRepo.documentExist({ _id: id, user_id: userId })
    if (!existingEvent)
      throw new NotFoundException('Event does not exist on user\'s calender');

    // Delete the event
    await this.eventRepo.findAndDelete({ _id: id, user_id: userId });
   return true;
  }
}
