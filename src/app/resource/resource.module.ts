import { Module } from '@nestjs/common';
import { ResourceService } from './resource.service';
import { ResourceController } from './resource.controller';
import { ResourceRepository } from "@app/resource/resource.repository";
import { MongooseModule } from "@nestjs/mongoose";
import { Resource, ResourceSchema } from "@app/resource/entities/resource.entity";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Resource.name, schema: ResourceSchema },
    ]),
  ],
  controllers: [ResourceController],
  providers: [ResourceService, ResourceRepository]
})
export class ResourceModule {}
