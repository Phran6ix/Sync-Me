import { TGroup } from "../implementation/group.implementation";
import { IWaitlist } from "../../interfaces/waitlist.interface";
import { IUser } from "../../interfaces/user.interface";
import { TWaitlist } from "../implementation/waitlist.implementation";
import { TUser } from "../implementation/user.implementation";

interface IRepoWaitlist<T> {
  createAWaitlist(payload: Partial<IWaitlist>): Promise<T>;
  findAWaitlist(groupid: TGroup["_id"]): Promise<T>;
  getAUserInWaitlist(
    userid: IUser["_id"],
    wailistid: TWaitlist["_id"]
  ): Promise<TUser>;
}

export default IRepoWaitlist;
