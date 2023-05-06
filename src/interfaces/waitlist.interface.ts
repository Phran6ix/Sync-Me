import { Types } from "mongoose";
import { TGroup } from "../modules/implementation/group.implementation";
import { TUser } from "../modules/implementation/user.implementation";

export interface IWaitlist {
  _id: string;
  group: TGroup["_id"];
  waiting: {
    user: TUser["_id"];
    accepted?: boolean;
    createdOn?: Date;
  }[];
}
