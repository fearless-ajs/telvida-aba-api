import { ConflictException, Injectable } from "@nestjs/common";
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventRepository } from "@app/event/event.repository";
import { Event } from "@app/event/entities/event.entity";
import { Request } from "express";

@Injectable()
export class EventService {
  constructor(private readonly eventRepo: EventRepository,) {}

  async create(createEventDto: CreateEventDto, userId: string): Promise<Event>{
    const { title, date } = createEventDto;
    // Check if the event exists
    const existingEvent = await this.eventRepo.documentExist({ title, date, user_id: userId })
    if (existingEvent)
      throw new ConflictException('Event already exist in your calender');

    return this.eventRepo.create({
      ...createEventDto,
      user_id: userId
    })
  }

  async findAll(req: Request): Promise<Event[]> {
    return this.eventRepo.findAll(req);
  }

  async findOne(id: string): Promise<Event> {
    return this.eventRepo.findById(id);
  }

  async update(id: string, userId: string, updateEventDto: UpdateEventDto): Promise<Event> {
    const { title, date } = updateEventDto;

    // Check if the event exists
    const existingEvent = await this.eventRepo.documentExist({ title, date, user_id: userId, _id: { $ne: id}})
    if (existingEvent)
      throw new ConflictException('Another Event of this title and date already exist in your calender');

    // update the event record
    return this.eventRepo.findOneAndUpdate({ _id: id }, updateEventDto);
  }

  async remove(id: string, userId: string): Promise<Boolean> {
    // Check if the event exists
    const existingEvent = await this.eventRepo.documentExist({ _id: id, user_id: userId })
    if (existingEvent)
      throw new ConflictException('Event does not exist on user\'s calender');

    // Delete the event
    await this.eventRepo.findAndDelete({ _id: id, user_id: userId });
   return true;
  }
}
