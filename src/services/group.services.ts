import crypto from "crypto";

import GroupRepo from "../modules/implementation/group.implementation";
import { IGroup } from "../interfaces/group.interface";
import { groupSchema } from "../validator/group.validator";
import { TGroup } from "../modules/implementation/group.implementation";
import { IUser } from "../interfaces/user.interface";
import HTTPException from "../exception/exceptions";
import { TUser } from "../modules/implementation/user.implementation";
import UserRepo from "../modules/implementation/user.implementation";
import { Group } from "../database/models";

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
      const group = await this.group_repo.getAGroupById(id);
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

      if (this.group_repo.userInGroup(group, userdata.id))
        throw new HTTPException("User already in group", 400);

      group.members.push(userdata.id);
      await group.save();

      return group;
    } catch (error) {
      throw error;
    }
  }

  async createLinkForGroup(
    url: string,
    id: TGroup["_id"],
    user: IUser["_id"]
  ): Promise<String> {
    try {
      const group = await this.group_repo.getAGroupById(id);
      if (!group)
        throw new HTTPException("Group with this ID does not exist", 404);

      console.log(group);
      if (!this.group_repo.userInGroup(group, user))
        throw new HTTPException("You are not authorized for this action", 400);

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
      const group = await this.group_repo.getAGroupById(id);
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
      const group = (await Group.findById(id)) as TGroup;

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
      const group: TGroup = await this.group_repo.getAGroupById(groupid);

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
      const group = await this.group_repo.getAGroupById(groupid);

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

  async joinGroupViaLink(
    code: IGroup["code"],
    user: IUser["_id"]
  ): Promise<string> {
    try {
      const group: TGroup = await this.group_repo.findAGroupByCode(code);
      if (!group) throw new HTTPException("Invalid code", 404);

      if (this.group_repo.userInGroup(group, user))
        throw new HTTPException("You are already a member of this group", 400);

      group.members.push(user);
      await group.save();

      return group.name;
    } catch (error) {
      throw error;
    }
  }

  async getUsersGroup(user: TUser["_id"]): Promise<TGroup[]> {
    try {
      const data = await this.group_repo.getUserGroups(user);
      // if (data.length < 1)
      //   throw new HTTPException("You do not belong in any group", 400);

      return data;
    } catch (error) {
      throw error;
    }
  }
}
