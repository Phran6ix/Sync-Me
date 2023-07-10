import { TTask } from "../../database/models";
export default interface ITaskRepo<T> {
  createTask(payload: Partial<T>): Promise<T>;
  getAllTaskInGroup(group: string): any; //Promise<T[]>;
  getATask(id: TTask["_id"]): Promise<T | null>;
  updateTask(id: TTask["_id"], data: Partial<T>): Promise<T>;
  getTaskWithTaskList(task_id: string): Promise<T>;
  //   updateTaskInTask(tasklist_id: string): Promise<Boolean>;
}
