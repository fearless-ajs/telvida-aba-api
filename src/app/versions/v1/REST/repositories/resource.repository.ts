import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import { AbstractRepository } from "@libs/database/abstract.repository";
import { Resource } from "@app/versions/v1/REST/entities/resource.entity";

@Injectable()
export class ResourceRepository extends AbstractRepository<Resource> {
  protected readonly logger = new Logger(ResourceRepository.name);

  constructor(
    @InjectModel(Resource.name) resourceModel: Model<Resource>,
    @InjectConnection() connection: Connection,
  ) {
    super(resourceModel, connection);
  }
}
