import { NextFunction, Request, Response, Router } from "express";
import BaseController from "./BaseController";
import TaskService from "../services/task.services";
import ITaskRepo from "../modules/repository/task.repository";
import { TTask } from "../database/models";
import { protect } from "../middleware/auth.middleware";
import TaskRepo from "../modules/implementation/task.implementation";
import HTTPException from "../exception/exceptions";

export default class TaskController extends BaseController {
  public router: Router = Router();
  public path: string = "/tasks";
  private task_repo;

  constructor() {
    super();
    this.task_repo = new TaskService(new TaskRepo());
    this.executeRoutes();
  }

  executeRoutes() {
    this.router.post(`${this.path}`, protect, (...x) =>
      this.HTTPAddTaskToGroup(...x)
    );
    this.router.get(`${this.path}`, protect, (...a) =>
      this.HTTPGetTaskOnGroup(...a)
    );

    this.router.get(`${this.path}/:task`, protect, (...a) =>
      this.HTTPGetATask(...a)
    );

    this.router.patch(`${this.path}/add-task/:task`, protect, (...a) =>
      this.HTTPAddTasksToTask(...a)
    );
    this.router.patch(`${this.path}/update-task`, protect, (...a) =>
      this.HTTPUpdateTaskInGroup(...a)
    );
    this.router.patch(`${this.path}/mark-as-complete`, protect, (...a) =>
      this.HTTPMarkTaskAsComplete(...a)
    );
  }

  async HTTPAddTaskToGroup(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {
      const task = await this.task_repo.addTaskToGroup(req.body);
      return this.sendResponse(res, 201, {
        message: "Task successfully added",
      });
    } catch (error) {
      next(error);
    }
  }

  async HTTPGetTaskOnGroup(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {
      const tasks = await this.task_repo.getTasksOnGroup(`${req.query.group}`);
      return this.sendResponse(res, 200, tasks);
    } catch (error) {
      next(error);
    }
  }

  async HTTPGetATask(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {
      const task = await this.task_repo.getATask(req.params.task);
      return this.sendResponse(res, 200, task);
    } catch (error) {
      next(error);
    }
  }

  async HTTPAddTasksToTask(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {
      await this.task_repo.addTasksToTask(req.params.task, req.body.title);
      return this.sendResponse(res, 200, { message: "Task added" });
    } catch (error) {
      next(error);
    }
  }

  async HTTPUpdateTaskInGroup(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {
      await this.task_repo.updateTaskInGroup(req.params.task, req.body);
      return this.sendResponse(res, 204, {});
    } catch (error) {
      next(error);
    }
  }

  async HTTPMarkTaskAsComplete(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {
      await this.task_repo.markTasksAsComplete(`${req.query.sub_task}`);
      return this.sendResponse(res, 204, { message: "Successful" });
    } catch (error) {
      next(error);
    }
  }
}
