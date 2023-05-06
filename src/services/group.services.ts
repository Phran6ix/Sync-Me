import crypto from "crypto";

import GroupRepo from "../modules/implementation/group.implementation";
import { IGroup } from "../interfaces/group.interface";
import { groupSchema } from "../validator/group.validator";
import { TGroup } from "../modules/implementation/group.implementation";
import { IUser } from "../interfaces/user.interface";
import HTTPException from "../exception/exceptions";
import { TUser } from "../modules/implementation/user.implementation";
import UserRepo from "../modules/implementation/user.implementation";

export default class GroupServices {
  private group_repo;
  private user_repo;
  constructor() {
    this.group_repo = new GroupRepo();
    this.user_repo = new UserRepo();
  }

  async addANewGroup(payload: Partial<IGroup>): Promise<void> {
    try {
      const data = await groupSchema.validate(payload);

      const code = crypto
        .createHash("sha256")
        .update(`${payload.name}${payload.created_on}`)
        .digest("hex")
        .toString()
        .slice(0, 10);

      const newGroup = await this.group_repo.createGroup({ code, ...data });
      return;
    } catch (error) {
      throw error;
    }
  }

  async addAMemberToGroup(id: string, user: Partial<TUser>): Promise<IGroup> {
    try {
      const group = await this.group_repo.findAGroup(id);
      if (!group) {
        throw new HTTPException("Group not found", 404);
      }

      let userdata;

      if (user.email) {
        userdata = await this.user_repo.findUserByEmail(user.email);
      }
      if (user.username) {
        userdata = await this.user_repo.findUserByUsername(user.username);
      }

      if (this.group_repo.userInGroup(group, userdata._id))
        throw new HTTPException("User already in group", 400);

      group.members.push(userdata._id);
      await group.save();
      return group;
    } catch (error) {
      throw error;
    }
  }

  async createLinkForGroup(url: string, id: string): Promise<String> {
    try {
      const group = await this.group_repo.findAGroup(id);
      url = url + `${group.code}`;
      return url;
    } catch (error) {
      throw error;
    }
  }

  async updateGroup(
    userid: string,
    id: string,
    payload: Partial<IGroup>
  ): Promise<void> {
    try {
      const group = await this.group_repo.findAGroup(id);
      if (!group)
        throw new HTTPException("Group with this ID does not exist", 404);

      if (!this.group_repo.isAdmin(group, userid)) {
        throw new HTTPException("You are not authorized for this action", 403);
      }

      await this.group_repo.updateGroup(id, payload);
      return;
    } catch (error) {
      throw error;
    }
  }

  async uploadPhoto(
    id: TGroup["_id"],
    userid: TUser["_id"],
    payload: { photo: string }
  ): Promise<void> {
    try {
      const group: TGroup = await this.group_repo.findAGroup(id);

      if (!group)
        throw new HTTPException("Group with this id does not exist", 404);

      if (!this.group_repo.isAdmin(group, userid))
        throw new HTTPException("You are not authorized for this action", 403);

      group.photo = payload.photo;
      await group.save();
      return;
    } catch (error) {
      throw error;
    }
  }
  async leaveGroup(
    groupid: TGroup["_id"],
    user: TUser["_id"]
  ): Promise<IGroup> {
    try {
      const group: TGroup = await this.group_repo.findAGroup(groupid);

      if (!this.group_repo.userInGroup(group, user))
        throw new HTTPException("You are not a member of this group", 404);

      let members = group.members.filter((users) => {
        return users != user;
      });

      group.members = members;
      await group.save();
      return group;
    } catch (error) {
      throw error;
    }
  }

  async getGroupDetails(groupid: TGroup["_id"]): Promise<TGroup> {
    try {
      const group = await this.group_repo.findAGroup(groupid);
      await group.populate({
        path: "members",
      });
      return group;
    } catch (error) {
      throw error;
    }
  }

  async removeUserFromGroup(
    groupid: TGroup["_id"],
    userid: TUser["_id"],
    loggedinUser: TUser["_id"]
  ): Promise<void> {
    try {
      const group: TGroup = await this.group_repo.getAGroupById(groupid);
      if (!group)
        throw new HTTPException("Group with this ID does not exist", 404);

      if (!(await this.group_repo.isAdmin(group, loggedinUser)))
        throw new HTTPException(
          "You are not authorized to perform this action",
          403
        );

      let members = group.members.filter((auser) => {
        return auser != userid;
      });

      group.members = members;
      await group.save();
      return;
    } catch (error) {
      throw error;
    }
  }
}

//TODO
// AN ENDPOINT TO REMOVE A USER BY ADMIN
