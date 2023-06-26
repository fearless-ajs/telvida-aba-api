import { User } from "@app/user/entities/user.entity";

export class ForgotPasswordEvent {
  constructor(public readonly user: User, public readonly token: number) {}
}