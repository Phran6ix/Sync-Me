import { NextFunction, Request, Response, Router } from "express";
import GroupServices from "../services/group.services";
import BaseController from "./BaseController";
import { groupSchema } from "../validator/group.validator";
import { protect } from "../middleware/auth.middleware";

export default class GroupController extends BaseController {
  public router: Router = Router();
  public path: string = "/group";
  private groupservice = new GroupServices();
  constructor() {
    super();
    this.initializeRoute();
  }

  public initializeRoute(): void {
    this.router.post(`${this.path}/new`, protect, (...args) =>
      this.HTTPCreateNewGroup(...args)
    );
    this.router.patch(`${this.path}/add-user`, protect, (...args) =>
      this.HTTPAddAMemberToGroup(...args)
    );
    this.router.get(`${this.path}/get-link/:id`, protect, (...args) =>
      this.HTTPGetGroupLink(...args)
    );
    this.router.patch(`${this.path}/upload-photo`, protect, (...a) =>
      this.HTTPUploadPhoto(...a)
    );
  }

  private async HTTPCreateNewGroup(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {
      await this.groupservice.addANewGroup({
        createdBy: req.user._id,
        ...req.body,
      });

      return this.sendResponse(res, "success", 201, {
        message: "You have created a group successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  private async HTTPAddAMemberToGroup(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {
      const group = await this.groupservice.addAMemberToGroup(
        "" + req.query.group,
        req.body.user
      );
      return this.sendResponse(res, "success", 200, {
        message: `User added to ${group.name}`,
      });
    } catch (error) {
      next(error);
    }
  }

  private async HTTPGetGroupLink(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {
      let url = `${req.protocol}://${req.get("host")}/group/link/`;

      const groupurl = await this.groupservice.createLinkForGroup(
        url,
        req.params.id
      );

      return this.sendResponse(res, "success", 202, {
        url: groupurl,
      });
    } catch (error) {
      next(error);
    }
  }

  private async HTTPUpdateGroup(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {
      await this.groupservice.updateGroup(
        req.user._id,
        req.params.id,
        req.body
      );
      return this.sendResponse(res, "success", 203);
    } catch (error) {
      next(error);
    }
  }

  private async HTTPUploadPhoto(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {
      await this.groupservice.uploadPhoto(req.params.id, req.user.id, {
        photo: req.body.photo,
      });
      return this.sendResponse(res, "success", 202, {
        message: "Photo uploaded successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}
