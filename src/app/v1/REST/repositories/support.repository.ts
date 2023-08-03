import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import { AbstractRepository } from "@libs/database/abstract.repository";
import { Support } from "@app/v1/REST/entities/support.entity";


@Injectable()
export class SupportRepository extends AbstractRepository<Support> {
  protected readonly logger = new Logger(SupportRepository.name);

  constructor(
    @InjectModel(Support.name) supportModel: Model<Support>,
    @InjectConnection() connection: Connection,
  ) {
    super(supportModel, connection);
  }
}
