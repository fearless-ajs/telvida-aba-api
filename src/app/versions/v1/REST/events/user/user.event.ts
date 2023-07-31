import { User } from "@app/versions/v1/REST/entities/user.entity";

export class UserEvent {
  constructor(public readonly user: User) {}
}