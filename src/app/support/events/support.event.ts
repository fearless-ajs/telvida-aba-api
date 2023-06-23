import { User } from "@app/user/entities/user.entity";
import { Support } from "@app/support/entities/support.entity";

export class SupportEvent {
  constructor(public readonly user: User, public readonly support: Support) {
  }
}