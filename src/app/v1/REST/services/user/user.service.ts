import {
  ConflictException,
  Injectable,
  NotAcceptableException,
  UnauthorizedException
} from "@nestjs/common";
import { CreateUserDto } from '../../dto/user/create-user.dto';
import { UpdateUserDto } from '../../dto/user/update-user.dto';
import {randomInt} from "crypto";
import * as bcrypt from 'bcrypt';
import mongoose, {Model} from "mongoose";
import {InjectModel} from "@nestjs/mongoose";
import { Request } from "express";
import {UserRepository} from "../../repositories/user.repository";
import {User, UserDocument} from "../../entities/user.entity";
import { deleteFile } from "@libs/helpers/file-processor";
import {ConfigService} from "@nestjs/config";
import { IFilterableCollection } from "@libs/helpers/response-controller";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { events } from "@config/constants";
import { UserEvent } from "@app/v1/REST/events/user/user.event";

@Injectable()
export class UserService{
  constructor(
      @InjectModel(User.name) private userModel: Model<UserDocument>,
      private readonly userRepository: UserRepository,
      private readonly configService: ConfigService,
      private readonly eventEmitter: EventEmitter2,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { email, password } = createUserDto;

    // generate verification code
    const code = randomInt(100000, 9999999);

    // @ts-ignore
    const hash = await bcrypt.hash(password, 10);

    // CHeck if the phone number already exists.
    if (await this.findOneByEmail(email)) throw new ConflictException(`Email exist`)

   const user = await this.userRepository.create({
      email,
      password: hash,
      emailVerificationToken: code.toString()
    });

    // Emit a user created Event
    this.eventEmitter.emit(events.USER_CREATED, new UserEvent(user));

    return user
  }

  async findAll(req: Request): Promise<IFilterableCollection> {
    return this.userRepository.findAllFiltered(req);
  }

  async findOne(id: string): Promise<User> {
    // Check if the user_id is valid
    // Check if the account object_id is valid
    if (!mongoose.isValidObjectId(id)) {
      throw new NotAcceptableException(`Invalid user id (${id})`)
    }

    return this.userRepository.documentExist({_id: id});
  }


  async validateUser(email: string, password: string) {
    const user = await this.findOneByEmailWithPassword(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) throw new UnauthorizedException('Invalid credentials');

    // Check if user email is verified
    if (!user.emailVerificationStatus) throw new UnauthorizedException('Unverified account');

    return user;
  }

  async getUser(getUserArgs: Partial<User>) {
    return this.userRepository.documentExist(getUserArgs);
  }

  async findOneByEmail(email: string): Promise<User> {
    return this.userModel.findOne({ email }).select('+password, +emailVerificationToken');
  }

  async findOneByEmailWithPassword(email: string): Promise<User> {
    return this.userModel.findOne({ email }).select('+password');
  }

  async findOneByUsername(username: string): Promise<User> {
    return this.userModel.findOne({ username }).select('+password');
  }

  async findOneByFilterWithRefreshToken(filter: any): Promise<User> {
    return this.userModel.findOne({ ...filter }).select('+refreshToken');
  }

  findOneByFilter(filter: any): Promise<User> {
    return this.userModel.findOne({ ...filter }).exec();
  }


  async checkUserVerificationToken(verificationToken:string):Promise<User> {
    return this.userModel.findOne({emailVerificationToken: verificationToken, active: false, emailVerificationStatus: false});
  }

  async checkUserPasswordToken(verificationToken:string):Promise<User> {
    return this.userModel.findOne({ passwordResetToken: verificationToken });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const { email, username } = updateUserDto;

    // Check if the id is valid
    if (!mongoose.isValidObjectId(id)){
      await deleteFile(updateUserDto.image);
      await deleteFile(updateUserDto.identity_proof);
      throw new NotAcceptableException(`Invalid user id (${id})`)
    }

    // Find the party exists
    const user = await this.findOne(id)
    if (!user){
      await deleteFile(updateUserDto.image);
      await deleteFile(updateUserDto.identity_proof);
      throw new NotAcceptableException(`Unknown user id (${id})`)
    }

    // CHeck if the email already exists.
    if (email){
      if (await this.userRepository.documentExist({ email,  _id: { $ne: id}  })){
        await deleteFile(updateUserDto.image);
        await deleteFile(updateUserDto.identity_proof);
        throw new ConflictException(`Email exist`)
      }
    }

    // CHeck if the username already exists.
    if (username){
      if (await this.userRepository.documentExist({ username,  _id: { $ne: id}  })){
        await deleteFile(updateUserDto.image);
        await deleteFile(updateUserDto.identity_proof);
        throw new ConflictException(`Username exist`)
      }
    }

    delete updateUserDto.password
    if (updateUserDto.image){
      // Delete image
      await deleteFile(user.image);
    }else {
      updateUserDto.image = user.image;
    }

    if (updateUserDto.identity_proof){
      // Delete image
      await deleteFile(user.identity_proof);
    }else {
      updateUserDto.identity_proof = user.identity_proof;
    }

    return await this.userRepository.findOneAndUpdate({ _id: id }, updateUserDto);
  }

  async findOneByIdAndUpdate(id: string, userData): Promise<User>{
    // Update the user
    return this.userModel.findOneAndUpdate({_id: id}, userData, {
      new: true, //To return the updated version of the document
      runValidators: true // To validate inputs based on the Model schema
    }).exec()
  }

  async remove(id: string): Promise<User> {
    if (!mongoose.isValidObjectId(id)){
      throw new NotAcceptableException(`Invalid user id (${id})`)
    }

    // Find the election event if i exists
    if (!await this.findOne(id)){
      throw new NotAcceptableException(`Unknown election user id (${id})`)
    }
    const user = await this.userRepository.findOne({_id: id});
    await deleteFile(user.image);

    return await this.userRepository.findAndDelete({ _id: id });
  }


  }
