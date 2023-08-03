import { User } from "@app/v1/REST/entities/user.entity";

export class UserEvent {
  constructor(public readonly user: User) {}
}