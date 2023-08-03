import { User } from "@app/v1/REST/entities/user.entity";

export class UserLoggedInEvent {
  constructor(public readonly user: User) {}
}