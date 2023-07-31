import { Module } from '@nestjs/common';
import { EventService } from '../services/event/event.service';
import { EventController } from '../controllers/event/event.controller';
import { EventRepository } from "@app/versions/v1/REST/repositories/event.repository";
import { MongooseModule } from "@nestjs/mongoose";
import { Event, EventSchema } from "@app/versions/v1/REST/entities/event.entity";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Event.name, schema: EventSchema },
    ]),
  ],
  controllers: [EventController],
  providers: [EventService, EventRepository]
})
export class EventModule {}
