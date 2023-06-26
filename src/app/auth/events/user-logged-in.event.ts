import { User } from "@app/user/entities/user.entity";

export class UserLoggedInEvent {
  constructor(public readonly user: User) {}
}