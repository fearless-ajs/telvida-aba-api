import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotAcceptableException,
} from "@nestjs/common";
import { Observable } from 'rxjs';
import {AccessTokenRepository} from "@app/v1/REST/repositories/access-token.repository";
import { errors } from "@config/config";

@Injectable()
export class ProtectedRouteGuard implements CanActivate {
  constructor(private accessTokenRepo: AccessTokenRepository) {}


  async canActivate(
    context: ExecutionContext,
    // @ts-ignore
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const { aba_access_token } = request.headers;

    if (!aba_access_token) {
      throw new ForbiddenException({
        status: errors.FORBIDDEN_ERROR,
        message: 'Forbidden resource'
      });
    }

    //try to verify the token
    const token  = await this.accessTokenRepo.documentExist({ token: aba_access_token });

    if (!token){
       throw new NotAcceptableException({
         status: errors.NOT_ACCEPTABLE_ERROR,
         message: `Invalid access token`
       })
    }

    // Check if the token has expired
    const expiry_date_stamp = Date.parse(token.expiry_date.toString());
    if (expiry_date_stamp <= Date.now()){
      throw new NotAcceptableException({
        status: errors.NOT_ACCEPTABLE_ERROR,
        message: `Expired access token`
      })
    }

    return true;
  }
}
