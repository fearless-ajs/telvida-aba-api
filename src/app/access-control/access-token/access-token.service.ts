import { ConflictException, Injectable, NotAcceptableException, NotFoundException } from "@nestjs/common";
import { CreateAccessTokenDto } from "./dto/create-access-token.dto";
import { UpdateAccessTokenDto } from "./dto/update-access-token.dto";
import mongoose from "mongoose";
import { Request } from "express";
import { AccessToken } from "./entities/access-token.entity";
import AccountHelper from "@libs/helpers/account-helper";
import { AccessTokenRepository } from "@app/access-control/access-token/access-token.repository";

@Injectable()
export class AccessTokenService{
  constructor(private accessTokenRepository: AccessTokenRepository){}

  async create(createAccessTokenDto: CreateAccessTokenDto, userId: string): Promise<AccessToken> {
   const { name, expiry_date, user_id } = createAccessTokenDto;

    // check if the user_id supplied is valid
    if (!mongoose.isValidObjectId(user_id))
      throw new NotAcceptableException(`Invalid user id (${user_id})`)

    //Check if the access_name exists
    if (await this.findOneByFilter({ name }))
      throw new ConflictException(`Access token name(${name}) exists`)

    // Check if the date is in the past
    const expiry_date_stamp = Date.parse(expiry_date.toString());
    if (expiry_date_stamp < Date.now())
      throw new NotAcceptableException(`You can not set past date`)

    // Generate access_token
    const token = await this.generateAccessToken();

    // Save the token to the database
    return await this.accessTokenRepository.create({
      name,
      token,
      expiry_date,
      user_id: userId
    });
  }

  async findAll(req: Request): Promise<AccessToken[]> {
    return this.accessTokenRepository.findAll(req);
  }

  async findOne(id: string): Promise<AccessToken> {
    // Check if the access_code object_id is valid
    if (!mongoose.isValidObjectId(id)) {
      throw new NotAcceptableException(`Invalid access token id (${id})`);
    }

    return this.accessTokenRepository.findOne({_id: id});
  }

  async findToken(access_token: string): Promise<AccessToken> {
    return this.accessTokenRepository.findOne({access_token: access_token});
  }


  async update(id: string, updateAccessTokenDto: UpdateAccessTokenDto): Promise<AccessToken> {
    const { name, expiry_date, user_id } = updateAccessTokenDto;

    // Check if the access_code object_id is valid
    if (!mongoose.isValidObjectId(id)) {
      throw new NotAcceptableException(`Invalid access token id (${id})`)
    }

    // Check if the Id exists
    if (!await this.findOne(id)){
      throw new NotFoundException(`Access code id (${id}) does not exist`);
    }

    //Check if the access_name exists
    if (await this.accessTokenRepository.documentExist({ name,  _id: { $ne: id} })){
      throw new ConflictException(`Access token name(${name}) exists`);
    }

    if (expiry_date){
      // Check if the date is in the past
      const expiry_date_stamp = Date.parse(expiry_date.toString());
      if (expiry_date_stamp < Date.now()){
        throw new NotAcceptableException(`You can not set past date`)
      }
    }

    return this.accessTokenRepository.findOneAndUpdate({_id: id}, updateAccessTokenDto);
  }

  async remove(id: string): Promise<AccessToken> {
    // Check if the access_code object_id is valid
    if (!mongoose.isValidObjectId(id)) {
      throw new NotAcceptableException(`Invalid access token id (${id})`)
    }

    // Check if the Id exists
    if (!await this.findOne(id)){
      throw new NotFoundException(`Access code id (${id}) does not exist`)
    }

    return  this.accessTokenRepository.findAndDelete({_id: id});
  }

  findOneByFilter(filter: any): Promise<AccessToken> {
    return this.accessTokenRepository.documentExist({ ...filter });
  }

  async generateAccessToken(): Promise<string> {

    const stringGenerator = new AccountHelper();
    const token = stringGenerator.randomCodeGenerator(100);

    // Check if the code exist
    if (await this.findOneByFilter({ token })){
      return this.generateAccessToken();
    }
    return token
  }

  async resetToken(id: string): Promise<AccessToken>{
    // Check if the access_code object_id is valid
    if (!mongoose.isValidObjectId(id)) {
      throw new NotAcceptableException(`Invalid access token id (${id})`)
    }

    // Check if the Id exists
    if (!await this.findOne(id)){
      throw new NotFoundException(`Access code id (${id}) does not exist`)
    }

    // Generate access_token
    const access_token = await this.generateAccessToken();

    return this.accessTokenRepository.findOneAndUpdate({_id: id}, {access_token});
  }
}
