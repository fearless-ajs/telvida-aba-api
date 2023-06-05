import {CanActivate, ExecutionContext, HttpException, HttpStatus, Inject, Injectable} from '@nestjs/common';
import { Observable } from 'rxjs';
import {UserService} from "@app/user/user.service";

@Injectable()
export class ActiveAccountGuard implements CanActivate {
  constructor(private userService: UserService) {}

  // @ts-ignore
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean | Promise<boolean> | Observable<boolean>> {
    const request = context.switchToHttp().getRequest();
    if (request.user){
      const user_info = await this.userService.findOne(request.user.userId);

      // check if the account is active or has tenant_uuid
      // if (!user_info.tenant_uuid){
      //   throw new HttpException('Incomplete account profile', HttpStatus.FORBIDDEN);
      // }

      request.user_full_info = user_info;
      return true;
    }

    return false
  }
}
