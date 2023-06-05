import { User } from "@app/user/entities/user.entity";

export type TTokens = {
  user?: User,
  access_token: string;
  refresh_token: string;
};
