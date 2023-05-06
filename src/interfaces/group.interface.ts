import { Document, Types } from "mongoose";
import { IUser } from "./user.interface";

export interface IGroup {
  _id: Types.ObjectId;
  name: string;
  description: string;
  members: string[] & Document;
  createdBy: string;
  created_on: Date;
  code: string;
  photo: string;
}
