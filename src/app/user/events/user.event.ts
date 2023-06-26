import { User } from "@app/user/entities/user.entity";

export class UserEvent {
  constructor(public readonly user: User) {}
}