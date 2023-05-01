import { Types } from "mongoose";
import { IGroup } from "./group.interface";

export interface ITasklist {
  title: string;
  completed: boolean;
}

export interface ITask {
  title: string;
  progress_rate: number;
  sharedBy: string;
  tasklists: string[]; //Types.DocumentArray<ITasklist>;
  deadline: Date;
  group: string; //Types.DocumentArray<IGroup>;
}
