import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';
import { Resource } from "@app/resource/entities/resource.entity";
import { ResourceRepository } from "@app/resource/resource.repository";
import { Request } from "express";
import { deleteFile } from "@libs/helpers/file-processor";

@Injectable()
export class ResourceService {
  constructor(private readonly resourceRepo: ResourceRepository) {}

  async create(createResourceDto: CreateResourceDto, userId: string): Promise<Resource> {
    return this.resourceRepo.create({
      ...createResourceDto,
      user_id: userId
    })
  }

  async findAll(req: Request): Promise<Resource[]> {
    return this.resourceRepo.findAll(req);
  }

  async findOne(id: string): Promise<Resource> {
    return this.resourceRepo.findById(id);
  }

  async update(id: string, userId: string, updateResourceDto: UpdateResourceDto) {
    const { file } = updateResourceDto;

    // Check if the resource exist fot the user
    const resource = await this.resourceRepo.documentExist({ _id: id, user_id: userId });
    if (!resource){
      await deleteFile(file);
      throw new NotFoundException(`Resource with the id ${id} does not exist for the user`)
    }

    if (file){
      // Delete the file
      await deleteFile(resource.file);
    }else {
      updateResourceDto.file = resource.file;
    }

    return this.resourceRepo.findOneAndUpdate({ _id: id, user_id: userId }, updateResourceDto);
  }

  async remove(id: string, userId: string): Promise<boolean> {
    // Check if the resource exist fot the user
    const resource = await this.resourceRepo.documentExist({ _id: id, user_id: userId });
    if (!resource){
      throw new NotFoundException(`Resource with the id ${id} does not exist for the user`)
    }

    // Delete the file
    await deleteFile(resource.file);

    // Delete the record from database
    await this.resourceRepo.findAndDelete({ _id: id, user_id: userId });
    return true;
  }
}
