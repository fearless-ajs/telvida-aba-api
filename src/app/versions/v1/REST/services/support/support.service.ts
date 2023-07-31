import { Injectable, NotAcceptableException, NotFoundException, Req } from "@nestjs/common";
import { CreateSupportDto } from '../../dto/support/create-support.dto';
import { UpdateSupportDto } from '../../dto/support/update-support.dto';
import { SupportRepository } from "@app/versions/v1/REST/repositories/support.repository";
import { Support } from "@app/versions/v1/REST/entities/support.entity";
import { randomTenString } from "@libs/helpers/string.helper";
import { Request } from "express";
import { IFilterableCollection } from "@libs/helpers/response-controller";
import mongoose from "mongoose";
import { deleteFile } from "@libs/helpers/file-processor";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { events } from "@config/constants";
import { SupportEvent } from "@app/versions/v1/REST/events/support/support.event";
import { UserService } from "@app/versions/v1/REST/services/user/user.service";
import { UpdateSupportStatusDto } from "@app/versions/v1/REST/dto/support/update-support-status.dto";

@Injectable()
export class SupportService {
  constructor(
    private readonly supportRepo: SupportRepository,
    private readonly userService: UserService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

 async create(createSupportDto: CreateSupportDto, userId: string): Promise<Support> {
    const reference_id = await this.generateReferenceId();

    const support = await this.supportRepo.create({
      user_id: userId,
      reference_id,
      ...createSupportDto
    });

    // Fetch the user details
    const user = await this.userService.findOne(userId);

    // Emit a support created Event
   this.eventEmitter.emit(events.SUPPORT_CREATED, new SupportEvent(user, support));

   // Return the support data
    return support;
  }

  async findAll(@Req() req: Request): Promise<IFilterableCollection> {
    return this.supportRepo.findAllFiltered(req);
  }

  async findOne(id: string): Promise<Support> {
    return this.supportRepo.findById(id);
  }

  async update(id: string, userId: string, updateSupportDto: UpdateSupportDto): Promise<Support> {
    const { attachment, status } = updateSupportDto;

    // check if the resource id is valid
    if (!mongoose.isValidObjectId(id)){
      throw new NotAcceptableException(`Invalid Support id: ${id}`)
    }

    // check if the user id is valid
    if (!mongoose.isValidObjectId(userId)){
      throw new NotAcceptableException(`Invalid User id: ${id}`)
    }

    // Check if the resource exist fot the user
    const support = await this.supportRepo.documentExist({ _id: id, user_id: userId });
    if (!support){
      await deleteFile(attachment);
      throw new NotFoundException(`Support with the id ${id} does not exist for the user`)
    }

    if (attachment){
      // Delete the file
      await deleteFile(support.attachment);
    }else {
      updateSupportDto.attachment = support.attachment;
    }

    // Fetch the user details
    const user = await this.userService.findOne(userId);

    // email the admin only
    const new_support = await this.supportRepo.findOneAndUpdate({ _id: id, user_id: userId }, updateSupportDto);


    if (status !== support.status){
      if (status === 'closed'){
        // Emit a support status closed Event
        this.eventEmitter.emit(events.SUPPORT_STATUS_CLOSED, new SupportEvent(user, new_support));
      }else {
        // Emit a support status updated Event
        this.eventEmitter.emit(events.SUPPORT_STATUS_CHANGED, new SupportEvent(user, new_support));
      }
    }

    // Emit a support updated Event
    this.eventEmitter.emit(events.SUPPORT_UPDATED, new SupportEvent(user, support));

    return new_support
  }

  async remove(id: string, userId: string): Promise<boolean> {
    // check if the resource id is valid
    if (!mongoose.isValidObjectId(id)){
      throw new NotAcceptableException(`Invalid Support id: ${id}`)
    }

    // check if the user id is valid
    if (!mongoose.isValidObjectId(userId)){
      throw new NotAcceptableException(`Invalid User id: ${id}`)
    }

    // Check if the resource exist fot the user
    const support = await this.supportRepo.documentExist({ _id: id, user_id: userId });
    if (!support){
      throw new NotFoundException(`Support with the id ${id} does not exist for the user`)
    }

    // Delete the file if exist
    await deleteFile(support.attachment);

    // Delete the record from database
    await this.supportRepo.findAndDelete({ _id: id, user_id: userId });
    return true;
  }


  async updateStatus(id: string, userId: string, updateSupportStatusDto: UpdateSupportStatusDto): Promise<Support> {
    const { status } = updateSupportStatusDto;

    // check if the resource id is valid
    if (!mongoose.isValidObjectId(id)){
      throw new NotAcceptableException(`Invalid Support id: ${id}`)
    }

    // check if the user id is valid
    if (!mongoose.isValidObjectId(userId)){
      throw new NotAcceptableException(`Invalid User id: ${id}`)
    }

    // Check if the resource exist fot the user
    const support = await this.supportRepo.documentExist({ _id: id, user_id: userId });
    if (!support){
      throw new NotFoundException(`Support with the id ${id} does not exist for the user`)
    }

    // Fetch the user details
    const user = await this.userService.findOne(userId);

    // email the admin only
    const new_support = await this.supportRepo.findOneAndUpdate({ _id: id, user_id: userId }, updateSupportStatusDto);
    if (status === 'closed'){
      // Emit a support status closed Event
      this.eventEmitter.emit(events.SUPPORT_STATUS_CLOSED, new SupportEvent(user, new_support));
    }else {
      // Emit a support status updated Event
      this.eventEmitter.emit(events.SUPPORT_STATUS_CHANGED, new SupportEvent(user, new_support));
    }

    return  new_support;
  }


  async generateReferenceId(): Promise<string> {
    const reference_id =  randomTenString();
    if (await this.supportRepo.documentExist({ reference_id })){
      await this.generateReferenceId();
    }
    return reference_id;
  }
}
