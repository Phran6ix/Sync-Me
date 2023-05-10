import { IGroup } from "../../interfaces/group.interface";

export default interface IEventsRepo<T> {
  createAnEvent(payload: Partial<T>): Promise<void>;
  getAllEvents(group_id: IGroup["_id"]): Promise<T[]>;
  //   getAnEvent(group_id: IGroup["_id"]): Promise<T | null>;
  getEventById(id: string): Promise<T>;
  updateAnEvent(id: string, payload: Partial<T>): Promise<T | null>;
  deleteAnEvent(id: string): Promise<void>;
}
