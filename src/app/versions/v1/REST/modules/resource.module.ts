import { Module } from '@nestjs/common';
import { ResourceService } from '../services/resource/resource.service';
import { ResourceController } from '../controllers/resource/resource.controller';
import { ResourceRepository } from '@app/versions/v1/REST/repositories/resource.repository';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Resource,
  ResourceSchema,
} from '@app/versions/v1/REST/entities/resource.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Resource.name, schema: ResourceSchema },
    ]),
  ],
  controllers: [ResourceController],
  providers: [ResourceService, ResourceRepository],
})
export class ResourceModule {}
