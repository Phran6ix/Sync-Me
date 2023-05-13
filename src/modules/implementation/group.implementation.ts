import { IGroupRepo } from "../repository/group.respository";
import { Group } from "../../database/models/groupModel";
import { IGroup } from "../../interfaces/group.interface";
import HTTPException from "../../exception/exceptions";
import { Document } from "mongoose";
import { redisClient } from "../../config/conect.redis";
import cacherepo from "./cache.implmentation";

export type TGroup = IGroup & Document;

export default class GroupRepo implements IGroupRepo<TGroup> {
  private group_model;
  private cache;
  constructor() {
    this.cache = new cacherepo();
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
    let groups: TGroup[];
    const redisgroups = await this.cache.getItemsFromCache<TGroup>("groups");

    if (redisgroups) return redisgroups;

    groups = await this.group_model
      .find()
      .populate("members", "-__v -isVerified")
      .populate("createdBy", "-__v -_id -isVerified");
    await this.cache.addItemToCache<TGroup[]>("group", groups);
    return groups;
  }

  async getAGroupById(id: string): Promise<TGroup> {
    const redisdata = await this.cache.getItemFromCache<TGroup>(`group-${id}`);
    if (redisdata) return redisdata;

    const data = await this.group_model
      .findById(id)
      .populate("members", "-__v -isVerified")
      .populate("createdBy", "-__v -_id -isVerified");

    await this.cache.addItemToCache<TGroup>(`group-${data._id}`, data);
    return data;
  }

  async updateGroup(id: string, payload: object): Promise<TGroup> {
    const data = this.group_model.findByIdAndUpdate(id, payload);
    await this.cache.updateDataInCache(`group-${id}`, data);
    return data;
  }

  async findAGroupByCode(code: string): Promise<TGroup> {
    return this.group_model.findOne({ code });
  }

  async getUserGroups(user_id: string): Promise<TGroup[]> {
    const redis_data = await this.cache.getItemsFromCache<TGroup>(
      `${user_id}-groups`
    );
    // if (redis_data) return redis_data;

    const useringroup = await this.group_model
      .find({
        members: user_id,
      })
      .populate("createdBy", "-__v -_id -isVerified -email ")
      .select("name description createdBy photo");

    await this.cache.addItemToCache<TGroup[]>(
      `${useringroup}-groups`,
      useringroup
    );
    return useringroup;
  }
}
