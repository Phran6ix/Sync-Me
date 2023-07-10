import { Document, Types } from "mongoose";
import { IUser } from "./user.interface";

export interface IGroup {
  id: string;
  name: string;
  description: string;
  members: string[];
  createdBy: string;
  created_on: Date;
  code: string;
  photo: string;
}
