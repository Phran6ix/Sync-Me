import ITaskRepo from "../modules/repository/task.repository";
import { TTask } from "../database/models";
import { taskSchema } from "../validator/task.validator";
import HTTPException from "../exception/exceptions";
import GroupRepo from "../modules/implementation/group.implementation";

export default class TaskService {
  private group_repo: GroupRepo = new GroupRepo();
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

  async getTasksOnGroup(group_id: TTask["group"]): Promise<any> {
    try {
      if (!group_id) throw new HTTPException("Group ID is required", 400);
      let tasks = await this.task_repo.getAllTaskInGroup(group_id);

      let popTask: TTask[] = [];

      // TASK: Populate the group field

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
      if (!task)
        throw new HTTPException("Task with this sub_task not fund", 404);

      task.tasklists.forEach((sub_task) => {
        if (`${sub_task._id}` == task_id) {
          sub_task.completed = true;
        }
      });

      await task.save();
      return;
    } catch (error) {
      throw error;
    }
  }
}
