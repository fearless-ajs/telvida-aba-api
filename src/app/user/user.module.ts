import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import {MongooseModule} from "@nestjs/mongoose";
import {User, UserSchema} from "./entities/user.entity";
import {UserRepository} from "./user.repository";

@Module({
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [UserService],
  imports: [
    MongooseModule.forFeature([
        { name: User.name, schema: UserSchema },
    ]),
  ],
})
export class UserModule {}
