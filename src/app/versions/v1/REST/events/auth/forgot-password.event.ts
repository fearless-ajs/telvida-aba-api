import { User } from "@app/versions/v1/REST/entities/user.entity";

export class ForgotPasswordEvent {
  constructor(public readonly user: User, public readonly token: number) {}
}