import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { EventRepository } from "@app/event/event.repository";
import { MongooseModule } from "@nestjs/mongoose";
import { Event, EventSchema } from "@app/event/entities/event.entity";

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
