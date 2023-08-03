import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import {UserService} from "@app/v1/REST/services/user/user.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UserService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string) {
    return this.usersService.validateUser(email, password);
  }
}
