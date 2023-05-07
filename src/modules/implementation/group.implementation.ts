import { IGroupRepo } from "../repository/group.respository";
import { Group } from "../../database/models/groupModel";
import { IGroup } from "../../interfaces/group.interface";
import HTTPException from "../../exception/exceptions";
import { Document } from "mongoose";

export type TGroup = IGroup & Document;

export default class GroupRepo implements IGroupRepo<TGroup> {
  private group_model;
  constructor() {
    this.group_model = Group;
  }

  async createGroup(Group: Partial<TGroup>): Promise<TGroup> {
    return await this.group_model.create(Group);
  }

  userInGroup(group: TGroup, user: string): Boolean {
    try {
      // const groups: TGroup = await this.group_model.findOne({ name: group });
      if (!group.members.includes(user)) {
        return false;
      }

      return true;
    } catch (error) {
      throw error;
    }
  }
  isAdmin(group: TGroup, user: string): Boolean {
    if (group.createdBy != user) {
      return false;
    }
    return true;
  }

  async getAllGroup(): Promise<TGroup[]> {
    return await this.group_model.find();
  }

  async getAGroupById(id: string): Promise<TGroup> {
    return await this.group_model.findById(id);
  }
  async updateGroup(id: string, payload: object): Promise<TGroup> {
    return this.group_model.findByIdAndUpdate(id, payload);
  }
  async findAGroupByCode(code: string): Promise<TGroup> {
    return this.group_model.findOne({ code });
  }
}
