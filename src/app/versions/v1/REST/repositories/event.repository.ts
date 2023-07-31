import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import { AbstractRepository } from "@libs/database/abstract.repository";
import { Event } from "@app/versions/v1/REST/entities/event.entity";

@Injectable()
export class EventRepository extends AbstractRepository<Event> {
  protected readonly logger = new Logger(EventRepository.name);

  constructor(
    @InjectModel(Event.name) eventModel: Model<Event>,
    @InjectConnection() connection: Connection,
  ) {
    super(eventModel, connection);
  }
}
