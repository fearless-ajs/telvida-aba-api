import {
  ConflictException, ForbiddenException,
  Injectable, NotAcceptableException,
  UnauthorizedException,
  UnprocessableEntityException
} from "@nestjs/common";
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {randomInt} from "crypto";
import * as bcrypt from 'bcrypt';
import mongoose, {Model} from "mongoose";
import {InjectModel} from "@nestjs/mongoose";
import { Request } from "express";
import {UserRepository} from "./user.repository";
import {User, UserDocument} from "./entities/user.entity";
import { deleteFile } from "@libs/helpers/file-processor";
import {ConfigService} from "@nestjs/config";

@Injectable()
export class UserService{
  constructor(
      @InjectModel(User.name) private userModel: Model<UserDocument>,
      private readonly userRepository: UserRepository,
      private readonly configService: ConfigService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { email, password } = createUserDto;

    // generate verification code
    const code = randomInt(100000, 9999999);

    // @ts-ignore
    const hash = await bcrypt.hash(password, 10);

    // CHeck if the phone number already exists.
    if (await this.findOneByEmail(email)) throw new ConflictException(`Email exist`)


    let user: Promise<User>;
    let now = new Date(Date.now());

    user = this.userRepository.create({
      email,
      password: hash,
      emailVerificationToken: code.toString()
    });

    // Email the user concerning the update


   return user
  }

  async findAll(req: Request): Promise<User[]> {
    return this.userRepository.findAll(req);
  }

  async findOne(id: string): Promise<User> {
    // Check if the user_id is valid
    // Check if the account object_id is valid
    if (!mongoose.isValidObjectId(id)) {
      throw new NotAcceptableException(`Invalid user id (${id})`)
    }

    return this.userModel.findOne({_id: id});
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
    return this.userRepository.findOne(getUserArgs);
  }

  private async validateCreateUserRequest(request: CreateUserDto) {
    let user: User;
    try {
      user = await this.userRepository.findOne({
        email: request.email,
      });
    } catch (err) {}

    if (user) {
      throw new UnprocessableEntityException('Email already exists.');
    }
  }

  async findOneByEmail(email: string): Promise<User> {
    return this.userModel.findOne({ email }).select('+password, +verificationToken');
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

  async update(id: string, currentUser: any, updateUserDto: UpdateUserDto): Promise<User> {
    const { email } = updateUserDto;
    console.log(currentUser);

    // check if the logged in user owns the account
    if (currentUser.userId !== id ){
      throw new ForbiddenException(`User account data can only be updated by the owner`)
    }

    // Check if the id is valid
    if (!mongoose.isValidObjectId(id)){
      throw new NotAcceptableException(`Invalid user id (${id})`)
    }

    // Find the party exists
    const user = await this.findOne(id)
    if (!user){
      throw new NotAcceptableException(`Unknown user id (${id})`)
    }

    // CHeck if the email already exists.
    if (email){
      if (await this.userModel.findOne({ email,  id: { $ne: id}  })){
        throw new ConflictException(`Email exist`)
      }
    }


    delete updateUserDto.password
    if (updateUserDto.image){
      // Delete logo
      await deleteFile(user.image);
    }else {
      updateUserDto.image = user.image;
    }

    return this.userModel.findOneAndUpdate({_id: id}, updateUserDto, {
      new: true, //To return the updated version of the document
      runValidators: true // To validate inputs based on the Model schema
    }).exec();
  }

  async findOneByIdAndUpdate(id: string, userData): Promise<User>{
    // Update the user
    return this.userModel.findOneAndUpdate({_id: id}, userData, {
      new: true, //To return the updated version of the document
      runValidators: true // To validate inputs based on the Model schema
    }).exec()
  }

  async remove(id: string,  currentUser: any,): Promise<User> {
    if (!mongoose.isValidObjectId(id)){
      throw new NotAcceptableException(`Invalid user id (${id})`)
    }

    // check if the logged in user owns the account
    if (currentUser.userId !== id ){
      throw new ForbiddenException(`User account data can only be modified by the owner`)
    }

    // Find the election event if i exists
    if (!await this.findOne(id)){
      throw new NotAcceptableException(`Unknown election user id (${id})`)
    }
    const user = await this.userModel.findOne({_id: id});
    await deleteFile(user.image);

    return user.delete();
  }


  }
