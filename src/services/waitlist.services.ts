import WaitlistRepo from "../modules/implementation/waitlist.implementation";
import HTTPException from "../exception/exceptions";
import { TGroup } from "../modules/implementation/group.implementation";
import { TUser } from "../modules/implementation/user.implementation";
import { TWaitlist } from "../modules/implementation/waitlist.implementation";

export default class WaitlistService {
  private waitlist_repo = new WaitlistRepo();

  async joinGroupWaitlist(
    groupid: TGroup["_id"],
    user: TUser["_id"]
  ): Promise<void> {
    try {
      let waitlist: TWaitlist;
      //   With the group id
      // check if a waitlist for this group exist, if it does not create one
      waitlist = await this.waitlist_repo.findAWaitlist(groupid);
      if (!waitlist) {
        waitlist = await this.waitlist_repo.createAWaitlist({ group: groupid });
      }
      // and the push the user
      waitlist.waiting.push({ user });
      await waitlist.save();
      return;
    } catch (error) {
      throw error;
    }
  }

  async getUsersInWaitlist(groupid: TGroup["_id"]): Promise<TWaitlist> {
    try {
      const waitlist = await this.waitlist_repo.findAWaitlist(groupid);
      await waitlist.populate({
        path: "waiting",
        populate: "user",
      });
      await waitlist.populate("group");
      return waitlist;
    } catch (error) {
      throw error;
    }
  }

  async acceptInvitation(
    userid: TUser["_id"],
    waitlistId: TWaitlist["_id"]
  ): Promise<void> {
    try {
      // Get User in Waitlist
      //   update the field
    } catch (error) {
      throw error;
    }
  }
}
