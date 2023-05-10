import IEventsRepo from "../repository/event.repository";
import { IEvents } from "../../interfaces/events.interface";
import { Events } from "../../database/models";
import { Document, Types, Model } from "mongoose";

export type TEvents = IEvents & Document;

export default class EventRepo implements IEventsRepo<TEvents> {
  private event_model: Model<TEvents>;

  constructor() {
    this.event_model = Events;
  }

  async createAnEvent(payload: Partial<TEvents>): Promise<void> {
    await this.event_model.create(payload);
    return;
  }
  async getAllEvents(group_id: Types.ObjectId): Promise<TEvents[]> {
    return await this.event_model.find({ group: group_id });
  }
  //   async getAnEvent(group_id: Types.ObjectId): Promise<TEvents> {
  //     return await this.event_model.findOne({ group: group_id });
  //   }
  async getEventById(id: string): Promise<TEvents> {
    return await this.event_model.findById(id);
  }
  async updateAnEvent(id: string, payload: Partial<TEvents>): Promise<TEvents> {
    return await this.event_model.findByIdAndUpdate(id, payload);
  }
  async deleteAnEvent(id: string): Promise<void> {
    await this.event_model.findByIdAndDelete(id);
  }
}
