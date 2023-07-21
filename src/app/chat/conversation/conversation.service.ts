import {
  ConflictException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
  UnprocessableEntityException
} from "@nestjs/common";
import { CreateConversationDto } from "./dto/create-conversation.dto";
import { ConversationRepository } from "@app/chat/conversation/conversation.repository";
import { Conversation } from "@app/chat/conversation/entities/conversation.entity";
import { Request } from "express";
import { IFilterableCollection } from "@libs/helpers/response-controller";
import { FriendshipService } from "@app/chat/friendship/friendship.service";
import { events } from "@config/constants";
import { ConversationCreatedEvent } from "@app/chat/conversation/entities/conversation-created.event";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { ConversationAttachmentService } from "@app/chat/conversation-attachment/conversation-attachment.service";
import { deleteFile } from "@libs/helpers/file-processor";
import mongoose from "mongoose";

type ConversationFilter = {
  friendship_id: string
}

@Injectable()
export class ConversationService {
  constructor(
    private readonly conversationRepo: ConversationRepository,
    private readonly conversationAttachmentService: ConversationAttachmentService,
    private readonly friendshipService: FriendshipService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async create(createConversationDto: CreateConversationDto, files: any[], senderId: string): Promise<Conversation> {
    const { friendship_id, message } = createConversationDto;
    let target_id;

    // Fetch friendship
    const friendship = await this.friendshipService.findOne(friendship_id)
    const { initiator_id, receiver_id } = friendship;

    // Determine the receiver.
    if (initiator_id.toString() === senderId){
      target_id = receiver_id;
    }else if (receiver_id.toString() === senderId){
      target_id = initiator_id;
    }else {
      // Delete all uploaded files
      for (const file of files) {
        await deleteFile(file.path);
      }
      throw new ConflictException("This friendship does not belong to the user")
    }

    // Create a transaction for the conversation and its attachments
    const session = await this.conversationRepo.startTransaction();
    try {
      // Save conversation to database
      const conversation = await this.conversationRepo.create({
        friendship_id,
        message,
        sender_id: senderId,
        receiver_id: target_id
      });

      // save conversation attachments to database
      for (const file of files) {
        await this.conversationAttachmentService.create({
          conversation_id: conversation._id.toString(),
          path: file.path,
          originalName: file.originalname,
          size: file.size,
          encoding: file.encoding,
          mimetype: file.mimetype,
          status: 'active',
        })
      }

      await session.commitTransaction();
      // Dispatch a conversation event, to be picked by rabbitMQ listener
      this.eventEmitter.emit(events.CONVERSATION_CREATED, new ConversationCreatedEvent(conversation));
      /*
        * attach files to the conversation
        * But delete field 'filename' and 'destination'
       */
      const fieldsToDelete = ['filename', 'destination'];
      conversation.attachments = files.map(obj => {
        const newObj = { ...obj };
        fieldsToDelete.forEach(field => delete newObj[field]);
        return newObj;
      });

      // Return the conversation to the user
      return conversation;
    } catch (err) {
      // Abort database transaction and reverse all effects
      await session.abortTransaction();
      // Delete all uploaded files
      for (const file of files) {
        await deleteFile(file.path);
      }
      // Throw exception containing the error message
      throw new UnprocessableEntityException(err.getMessage());
    }
  }

  async findAll(req: Request, userId: string): Promise<IFilterableCollection> {
    const { filter } = req.query as { filter: ConversationFilter };

    if (!filter || !filter.friendship_id) {
      throw new UnprocessableEntityException('You need to filter by friendship_id, like this: /conversations?filter[friendship_id]=sample_id');
    }

    const { friendship_id } = filter;
    // Check if the friendship_id is a valid mongodb Id
    if (!mongoose.isValidObjectId(friendship_id)){
      throw new NotAcceptableException(`Invalid friendship_id: ${friendship_id}`)
    }

    // Check if the user belongs to the friendship
    // Fetch friendship
    const friendship = await this.friendshipService.findOne(friendship_id)
    const { initiator_id, receiver_id } = friendship;

    if (initiator_id.toString() !== userId && receiver_id.toString() !== userId){
      throw new NotAcceptableException(`User does not belong to the friendship`)
    }

    return this.conversationRepo.findAllFiltered(req);
  }

  async remove(id: string): Promise<boolean> {
    // check if the id is valid
    if (!mongoose.isValidObjectId(id)){
      throw new NotAcceptableException(`Invalid conversation id: ${id}`)
    }

    // Fetch conversation data
    const conversation = await this.conversationRepo.documentExist({ _id: id });
    if (!conversation){
      throw new NotFoundException(`Conversation not found with the id: ${id}`)
    }

    // Fetch the conversation attachments
    const attachments =  await this.conversationAttachmentService.findByConversation(conversation._id.toString());

    // Create a database transaction for the delete operation
    const session = await this.conversationRepo.startTransaction();
    try {
      // Delete all attachments and uploaded files
      for (const file of attachments) {
        await this.conversationAttachmentService.removeById(file._id.toString())
        await deleteFile(file.path);
      }

      // Now delete the conversation
      await this.conversationRepo.findAndDelete({ _id: id });

      // Commit transaction
      await session.commitTransaction();
      return true;
    }catch (err) {
      // Abort database transaction and reverse all effects
      await session.abortTransaction();
      // Throw exception containing the error message
      throw new UnprocessableEntityException(err.getMessage());
    }
  }
}
