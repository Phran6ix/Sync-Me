import ITaskRepo from "../modules/repository/task.repository";
import { TTask } from "../database/models";
import { taskSchema } from "../validator/task.validator";
import HTTPException from "../exception/exceptions";

export default class TaskService {
  private task_repo;
  constructor(task_repo: ITaskRepo<TTask>) {
    this.task_repo = task_repo;
  }

  async addTaskToGroup(payload: Partial<TTask>): Promise<void> {
    try {
      const data = await taskSchema.validate(payload);
      await this.task_repo.createTask(data);
      return;
    } catch (error) {
      throw error;
    }
  }

  async getTasksOnGroup(group_id: TTask["group"]): Promise<TTask[]> {
    try {
      const tasks = await this.task_repo.getAllTaskInGroup(group_id);
      return tasks;
    } catch (error) {
      throw error;
    }
  }

  async getATask(task_id: TTask["_id"]): Promise<TTask> {
    try {
      const task = await this.task_repo.getATask(task_id);
      if (!task)
        throw new HTTPException("Task with this ID does not exist", 404);
      return task;
    } catch (error) {
      throw error;
    }
  }

  async addTasksToTask(task_id: TTask["_id"], tasklist: string): Promise<void> {
    try {
      const task = await this.task_repo.getATask(task_id);

      if (!task)
        throw new HTTPException("Task with this ID does not exist", 404);

      task.tasklists.push({ title: tasklist });
      await task.save();
      return;
    } catch (error) {
      throw error;
    }
  }

  async updateTaskInGroup(
    task_id: TTask["_id"],
    data: Partial<TTask>
  ): Promise<void> {
    try {
      const task = await this.task_repo.updateTask(task_id, data);

      if (!task)
        throw new HTTPException("An error occured, please try again", 400);
      return;
    } catch (error) {
      throw error;
    }
  }

  async markTasksAsComplete(task_id: string): Promise<void> {
    try {
      const task = await this.task_repo.getTaskWithTaskList(task_id);
      console.log(task);
    } catch (error) {
      throw error;
    }
  }
}
