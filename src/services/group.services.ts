import crypto from "crypto";

import GroupRepo from "../modules/implementation/group.implementation";
import { IGroup } from "../interfaces/group.interface";
import { groupSchema } from "../validator/group.validator";
import { TGroup } from "../modules/implementation/group.implementation";
import { IUser } from "../interfaces/user.interface";
import HTTPException from "../exception/exceptions";
import { TUser } from "../modules/implementation/user.implementation";

export default class GroupServices {
  private group_repo;
  constructor() {
    this.group_repo = new GroupRepo();
  }

  async addANewGroup(payload: Partial<IGroup>): Promise<void> {
    try {
      const data = await groupSchema.validate(payload);
      console.log(data);
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

  async addAMemberToGroup(id: string, user: IUser["_id"]): Promise<IGroup> {
    try {
      const group = await this.group_repo.findAGroup(id);
      if (!group) {
        throw new HTTPException("Group not found", 404);
      }

      if (!this.group_repo.userInGroup(group, user)) {
        throw new HTTPException("User already in group", 400);
      }
      group.members.push(user);
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
      const group = await this.group_repo.findAGroup(userid);
      if (this.group_repo.isAdmin(group, id)) {
        throw new HTTPException("You are authorized for this action", 403);
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

      if (!this.group_repo.isAdmin(group, userid))
        throw new HTTPException("You are not authorized for this action", 403);

      group.photo = payload.photo;
      await group.save();
      return;
    } catch (error) {
      throw error;
    }
  }
}
