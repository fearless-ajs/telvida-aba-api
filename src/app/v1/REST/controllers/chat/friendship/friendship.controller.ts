import { Controller, Get, Param, Delete, HttpCode, HttpStatus, Req } from "@nestjs/common";
import { FriendshipService } from '../../../services/chat/friendship/friendship.service';
import ResponseController, {
  IResponseWithDataCollection,
  IResponseWithMessage
} from "@libs/helpers/response-controller";
import { Request } from "express";

@Controller('friendships')
export class FriendshipController extends ResponseController{
  constructor(private readonly friendshipService: FriendshipService) {
    super();
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Req() req: Request): Promise<IResponseWithDataCollection> {
    const response_data = await this.friendshipService.findAll(req);
    return this.responseWithDataCollection(response_data);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.ACCEPTED)
  async remove(@Param('id') id: string): Promise<IResponseWithMessage> {
    await this.friendshipService.remove(id);
    return this.responseMessage('Friendship deleted');
  }
}
