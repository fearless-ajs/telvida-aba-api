import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, Req } from "@nestjs/common";
import { FriendshipInvitationService } from '../../../services/chat/friendship-invitation/friendship-invitation.service';
import { CreateFriendshipInvitationDto } from '../../../dto/chat/friendship-invitation/create-friendship-invitation.dto';
import { UpdateFriendshipInvitationStatusDto } from '../../../dto/chat/friendship-invitation/update-friendship-invitation-status.dto';
import ResponseController, {
  IResponseWithData,
  IResponseWithDataCollection,
  IResponseWithMessage
} from "@libs/helpers/response-controller";
import { GetCurrentUserId } from "@libs/decorators";
import { Request } from "express";

@Controller('friendship-invitations')
export class FriendshipInvitationController extends ResponseController{
  constructor(private readonly friendshipInvitationService: FriendshipInvitationService) {
    super();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createFriendshipInvitationDto: CreateFriendshipInvitationDto, @GetCurrentUserId() userId: string): Promise<IResponseWithData> {
    const response_data = await this.friendshipInvitationService.create(createFriendshipInvitationDto, userId);
    return this.responseWithData(response_data);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Req() req: Request): Promise<IResponseWithDataCollection> {
    const response_data = await this.friendshipInvitationService.findAll(req);
    return this.responseWithDataCollection(response_data);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string): Promise<IResponseWithData>  {
    const response_data = await this.friendshipInvitationService.findOne(id);
    return this.responseWithData(response_data);
  }

  // Updates status only
  @Patch(':id')
  @HttpCode(HttpStatus.ACCEPTED)
  async update(@Param('id') id: string, @Body() updateFriendshipInvitationStatusDto: UpdateFriendshipInvitationStatusDto): Promise<IResponseWithData>  {
    const response_data = await this.friendshipInvitationService.updateStatus(id, updateFriendshipInvitationStatusDto);
    return this.responseWithData(response_data);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.ACCEPTED)
  async remove(@Param('id') id: string): Promise<IResponseWithMessage> {
    await this.friendshipInvitationService.remove(id);
    return this.responseMessage('Invitation deleted');
  }
}
