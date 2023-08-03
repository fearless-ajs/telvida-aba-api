import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
  Query,
  Req,
} from '@nestjs/common';
import { CreateResourceDto } from '../../dto/resource/create-resource.dto';
import { UpdateResourceDto } from '../../dto/resource/update-resource.dto';
import { Resource } from '@app/v1/REST/entities/resource.entity';
import { ResourceRepository } from '@app/v1/REST/repositories/resource.repository';
import { Request } from 'express';
import { deleteFile } from '@libs/helpers/file-processor';
import mongoose from 'mongoose';
import { IFilterableCollection } from '@libs/helpers/response-controller';

@Injectable()
export class ResourceService {
  constructor(private readonly resourceRepo: ResourceRepository) {}

  async create(
    createResourceDto: CreateResourceDto,
    userId: string,
  ): Promise<Resource> {
    return this.resourceRepo.create({
      ...createResourceDto,
      user_id: userId,
    });
  }

  async findAll(@Req() req: Request): Promise<IFilterableCollection> {
    return this.resourceRepo.findAllFiltered(req);
  }

  async findOne(id: string): Promise<Resource> {
    return this.resourceRepo.findById(id);
  }

  async update(
    id: string,
    userId: string,
    updateResourceDto: UpdateResourceDto,
  ) {
    const { resource_file } = updateResourceDto;

    // check if the resource id is valid
    if (!mongoose.isValidObjectId(id)) {
      throw new NotAcceptableException(`Invalid Resource id: ${id}`);
    }

    // check if the user id is valid
    if (!mongoose.isValidObjectId(userId)) {
      throw new NotAcceptableException(`Invalid User id: ${id}`);
    }

    // Check if the resource exist fot the user
    const resource = await this.resourceRepo.documentExist({
      _id: id,
      user_id: userId,
    });
    if (!resource) {
      await deleteFile(resource_file);
      throw new NotFoundException(
        `Resource with the id ${id} does not exist for the user`,
      );
    }

    if (resource_file) {
      // Delete the file
      await deleteFile(resource.resource_file);
    } else {
      updateResourceDto.resource_file = resource.resource_file;
    }

    return this.resourceRepo.findOneAndUpdate(
      { _id: id, user_id: userId },
      updateResourceDto,
    );
  }

  async remove(id: string, userId: string): Promise<boolean> {
    // check if the resource id is valid
    if (!mongoose.isValidObjectId(id)) {
      throw new NotAcceptableException(`Invalid Resource id: ${id}`);
    }

    // check if the user id is valid
    if (!mongoose.isValidObjectId(userId)) {
      throw new NotAcceptableException(`Invalid User id: ${id}`);
    }

    // Check if the resource exist fot the user
    const resource = await this.resourceRepo.documentExist({
      _id: id,
      user_id: userId,
    });
    if (!resource) {
      throw new NotFoundException(
        `Resource with the id ${id} does not exist for the user`,
      );
    }

    // Delete the file
    await deleteFile(resource.resource_file);

    // Delete the record from database
    await this.resourceRepo.findAndDelete({ _id: id, user_id: userId });
    return true;
  }
}
