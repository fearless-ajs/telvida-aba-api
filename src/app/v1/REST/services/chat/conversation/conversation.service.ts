import {
  ConflictException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateConversationDto } from '../../../dto/chat/conversation/create-conversation.dto';
import { ConversationRepository } from '@app/v1/REST/repositories/conversation.repository';
import { Conversation } from '@app/v1/REST/entities/conversation.entity';
import { Request } from 'express';
import { IFilterableCollection } from '@libs/helpers/response-controller';
import { FriendshipService } from '@app/v1/REST/services/chat/friendship/friendship.service';
import { events } from '@config/constants';
import { ConversationCreatedEvent } from '@app/v1/REST/entities/conversation-created.event';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ConversationAttachmentService } from '@app/v1/REST/services/chat/conversation-attachment/conversation-attachment.service';
import { deleteFile } from '@libs/helpers/file-processor';
import mongoose from 'mongoose';
import { DeleteConversationDto } from '@app/v1/REST/dto/chat/conversation/delete-conversation.dto';
import { TQuery } from '@libs/database/abstract.repository';
import { ConversationsFetchEvent } from '@app/v1/REST/events/chat/conversation/conversations-fetch.event';
import { ConversationDeletedEvent } from '@app/v1/REST/events/chat/conversation/conversation-deleted.event';

@Injectable()
export class ConversationService {
  constructor(
    private readonly conversationRepo: ConversationRepository,
    private readonly conversationAttachmentService: ConversationAttachmentService,
    private readonly friendshipService: FriendshipService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async create(
    createConversationDto: CreateConversationDto,
    files: any[],
    senderId: string,
  ): Promise<Conversation> {
    const { friendship_id, message } = createConversationDto;

    // Check if the friendship_id is valid
    if (!mongoose.isValidObjectId(friendship_id)) {
      throw new NotAcceptableException(
        `Invalid friendship_id: ${friendship_id}`,
      );
    }

    let target_id;

    // Fetch friendship
    const friendship = await this.friendshipService.findOne(friendship_id);
    const { initiator_id, receiver_id } = friendship;

    // Determine the receiver.
    if (initiator_id.toString() === senderId) {
      target_id = receiver_id;
    } else if (receiver_id.toString() === senderId) {
      target_id = initiator_id;
    } else {
      // Delete all uploaded files
      for (const file of files) {
        await deleteFile(file.path);
      }
      throw new ConflictException(
        'This friendship does not belong to the user',
      );
    }

    // Create a transaction for the conversation and its attachments
    const session = await this.conversationRepo.startTransaction();
    try {
      // Save conversation to database
      const conversation = await this.conversationRepo.create({
        friendship_id,
        message,
        sender_id: senderId,
        receiver_id: target_id,
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
        });
      }

      await session.commitTransaction();
      // Dispatch a conversation event, to be picked by rabbitMQ listener
      this.eventEmitter.emit(
        events.CONVERSATION_CREATED,
        new ConversationCreatedEvent(conversation),
      );
      /*
       * attach files to the conversation
       * But delete field 'filename' and 'destination'
       */
      const fieldsToDelete = ['filename', 'destination'];
      conversation.attachments = files.map((obj) => {
        const newObj = { ...obj };
        fieldsToDelete.forEach((field) => delete newObj[field]);
        return newObj;
      });

      // Dispatch conversation created event
      this.eventEmitter.emit(
        events.CONVERSATION_CREATED,
        new ConversationCreatedEvent(conversation),
      );

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
    const { filter } = req.query as unknown as TQuery;
    filter.deleteForEveryone = false; // excludes the delete_for_everyone

    if (!filter || !filter.friendship_id) {
      throw new UnprocessableEntityException(
        'You need to filter by friendship_id, like this: /conversations?filter[friendship_id]=sample_id',
      );
    }

    const { friendship_id } = filter;
    // Check if the friendship_id is a valid mongodb Id
    if (!mongoose.isValidObjectId(friendship_id)) {
      throw new NotAcceptableException(
        `Invalid friendship_id: ${friendship_id}`,
      );
    }

    // Check if the user belongs to the friendship
    // Fetch friendship
    const friendship = await this.friendshipService.findOne(friendship_id);
    const { initiator_id, receiver_id } = friendship;

    if (
      initiator_id.toString() !== userId &&
      receiver_id.toString() !== userId
    ) {
      throw new NotAcceptableException(
        `User does not belong to the friendship`,
      );
    }

    // Construct the delete_for_me query
    const dbQuery = {
      $and: [
        { friendship_id },
        {
          $and: [
            { senderId: { $ne: userId } },
            { deleteForSender: { $ne: true } },
          ],
        },
      ],
    };
    // Add filter by delete_for_me and delete_for_everyone
    const conversations: Promise<IFilterableCollection> =
      this.conversationRepo.findAllFiltered(req, dbQuery);

    this.eventEmitter.emit(
      events.FETCH_CONVERSATIONS,
      new ConversationsFetchEvent(conversations),
    );

    return conversations;
  }

  async remove(
    deleteConversationDto: DeleteConversationDto,
    userId: string,
  ): Promise<boolean> {
    const { friendship_id, conversation_ids, delete_type } =
      deleteConversationDto;

    // Check if the friendship_id is valid
    if (!mongoose.isValidObjectId(friendship_id)) {
      throw new NotAcceptableException(
        `Invalid friendship_id: ${friendship_id}`,
      );
    }

    // check if the user belongs to the friendship
    // Fetch friendship
    const friendship = await this.friendshipService.findOne(friendship_id);
    const { initiator_id, receiver_id } = friendship;

    // Determine the friendship validity
    if (
      initiator_id.toString() !== userId &&
      receiver_id.toString() === userId
    ) {
      throw new ConflictException(
        'This friendship does not belong to the user',
      );
    }

    // Validate all Ids
    const faulty_conversation_ids: string[] = [];
    for (const conversation_id of conversation_ids) {
      // check if the id is valid
      if (!mongoose.isValidObjectId(conversation_id)) {
        faulty_conversation_ids.push(conversation_id);
      }
    }

    // Return the faulty conversation_ids as errors
    if (faulty_conversation_ids.length > 0) {
      throw new NotAcceptableException({
        message: 'Invalid conversation_ids',
        data: {
          invalids: faulty_conversation_ids,
        },
      });
    }

    /*
     * Check if the conversation exists
     * Check if it belongs to the user.
     * i.e. the user is either the sender or the receiver
     */
    const unknown_conversation_ids: string[] = [];
    const valid_conversations: Conversation[] = [];
    for (const conversation_id of conversation_ids) {
      // check if the conversation exists
      const conversation = await this.conversationRepo.documentExist({
        $and: [
          { _id: conversation_id },
          { friendship_id },
          {
            $or: [{ sender_id: userId }, { receiver_id: userId }],
          },
        ],
      });
      if (conversation) {
        valid_conversations.push(conversation);
      } else {
        unknown_conversation_ids.push(conversation_id);
      }
    }

    // Return the unknown conversation_ids as errors
    if (unknown_conversation_ids.length > 0) {
      throw new NotFoundException({
        message: 'Unknown conversation_ids',
        data: {
          invalids: unknown_conversation_ids,
        },
      });
    }

    // Create a database transaction for the delete operation, not actually deleting but updating
    const session = await this.conversationRepo.startTransaction();
    try {
      /*
       *
       * Check for incompatible delete types
       * Only sender can delete for everyone
       * delete for everyone must be within 2 days
       * delete for me is for anyone
       *
       */
      if (delete_type === 'for_me') {
        for (const conversation of valid_conversations) {
          // Check if the user is the sender or the receiver
          if (conversation.receiver_id.toString() === userId) {
            await this.conversationRepo.findOneAndUpdate(
              { _id: conversation._id },
              {
                deleteForReceiver: true,
              },
            );
          }

          if (conversation.sender_id.toString() === userId) {
            await this.conversationRepo.findOneAndUpdate(
              { _id: conversation._id },
              {
                deleteForSender: true,
              },
            );
          }
        }
      }

      if (delete_type === 'for_everyone') {
        for (const conversation of valid_conversations) {
          if (conversation.sender_id.toString() === userId) {
            // Check if the current date is not two days ahead of the creator
            // Step 1: Calculate the time difference in milliseconds.
            const updatedAt: Date = new Date(conversation.createdAt); // Replace with the actual value of `updatedAt` from your document.
            const currentTime: Date = new Date();
            const timeDifference: number =
              currentTime.getTime() - updatedAt.getTime();

            // Step 2: Convert time difference to days.
            const millisecondsPerDay: number = 24 * 60 * 60 * 1000; // Number of milliseconds in one day.
            const daysDifference: number = timeDifference / millisecondsPerDay;

            // Step 3: Check if the time difference is less than or equal to two days.
            if (daysDifference <= 2) {
              await this.conversationRepo.findOneAndUpdate(
                { _id: conversation._id },
                {
                  deleteForEveryone: true,
                },
              );
            }
          }
        }
      }
      // Commit transaction
      await session.commitTransaction();
      this.eventEmitter.emit(
        events.FETCH_CONVERSATIONS,
        new ConversationDeletedEvent('SUCCESS', valid_conversations),
      );
      return true;
    } catch (err) {
      // Abort database transaction and reverse all effects
      await session.abortTransaction();
      // Throw exception containing the error message
      throw new UnprocessableEntityException('Something went wrong');
    }
  }
}
