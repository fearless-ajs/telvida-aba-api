import { ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import {Reflector} from "@nestjs/core";
import {AuthGuard} from "@nestjs/passport";

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) : boolean | Promise<boolean> | Observable<boolean> {
    const isGuest = this.reflector.getAllAndOverride('isGuest', [
      context.getHandler(),
      context.getClass(),
    ]);


    if (isGuest) return true;

    return super.canActivate(context);
  }
}
