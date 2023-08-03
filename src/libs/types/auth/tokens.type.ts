import { User } from "@app/v1/REST/entities/user.entity";

export type TTokens = {
  user?: User,
  access_token: string;
  refresh_token: string;
};
