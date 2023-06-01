import { Task } from "../../database/models";
import { TTask } from "../../database/models";
import ITaskRepo from "../repository/task.repository";

export default class TaskRepo implements ITaskRepo<TTask> {
  async createTask(payload: Partial<TTask>): Promise<TTask> {
    return await Task.create(payload);
  }
  async getAllTaskInGroup(group: string): Promise<TTask[]> {
    return await Task.find({ group });
  }
  async getATask(id: string): Promise<TTask | null> {
    return await Task.findById(id);
  }
  async updateTask(id: string, data: Partial<TTask>): Promise<TTask> {
    return await Task.findByIdAndUpdate(id, data);
  }

  //   TASK
  // FIX THE TASKLIST LOGIC, IT'S MESSED UP - CREATE A SEPERATE MODEL FOR THE TASKLIST AND STORE THE ID ON THE TASKLIST FIELD
  // THAT SHOULD DO IT AND ALSO FIGURE OUT A WAY TO CALCULATE THE PROGRESS RATE
}
