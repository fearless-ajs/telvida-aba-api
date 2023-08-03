import { User } from "@app/v1/REST/entities/user.entity";
import { Support } from "@app/v1/REST/entities/support.entity";

export class SupportEvent {
  constructor(public readonly user: User, public readonly support: Support) {
  }
}