import { Document } from "mongoose";
import IRepoWaitlist from "../repository/waitlist.respository";
import { Waitlist } from "../../database/models/waitlistModel";
import { IWaitlist } from "../../interfaces/waitlist.interface";
import { IGroup } from "../../interfaces/group.interface";
import { TUser } from "./user.implementation";
import { TGroup } from "./group.implementation";

export type TWaitlist = IWaitlist & Document;

class WaitlistRepo implements IRepoWaitlist<TWaitlist> {
  private waitlist_model;
  constructor() {
    this.waitlist_model = Waitlist;
  }

  async getAUserInWaitlist(userid: string, waitlistid: any): Promise<TUser> {
    return await Waitlist.findOne({ id: waitlistid, "waiting.user": userid });
  }

  async createAWaitlist(payload: Partial<IWaitlist>): Promise<TWaitlist> {
    return await this.waitlist_model.create(payload);
  }

  async findAWaitlist(groupid: any): Promise<TWaitlist> {
    return await this.waitlist_model.findOne({ group: groupid });
  }
}

export default WaitlistRepo;
