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
    this.router.get(`${this.path}`, protect, (...a) =>
      this.HTTPGetGroupDetail(...a)
    );
    this.router.patch(`${this.path}/update/:id`, protect, (...a) =>
      this.HTTPUpdateGroup(...a)
    );
    this.router.delete(`${this.path}/remove-a-member`, protect, (...a) =>
      this.HTTPRemoveAUserFromGroup(...a)
    );

    this.router.get(`${this.path}/for-user`, protect, (...s) =>
      this.HTTPGetGroupsForUser(...s)
    );

    this.router.patch(`${this.path}/upload-photo/:id`, protect, (...a) =>
      this.HTTPUploadPhoto(...a)
    );
    this.router.get(`${this.path}/get-link/:id`, protect, (...args) =>
      this.HTTPGetGroupLink(...args)
    );
    this.router.delete(`${this.path}/leave-group/:id`, protect, (...a) =>
      this.HTTPLeaveGroup(...a)
    );
    this.router.patch(`${this.path}/link/:id`, protect, (...a) =>
      this.HTTPJoinGroupByLink(...a)
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
        req.body
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
        req.params.id,
        req.user._id
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
      await this.groupservice.uploadPhoto(req.params.id, req.user._id, {
        photo: req.body.photo,
      });
      return this.sendResponse(res, "success", 202, {
        message: "Photo uploaded successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  async HTTPLeaveGroup(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {
      console.log(req.user);
      const group = await this.groupservice.leaveGroup(
        req.params.id,
        req.user._id
      );
      return this.sendResponse(res, "success", 204, {
        message: `You have left ${group.name}`,
      });
    } catch (error) {
      next(error);
    }
  }

  private async HTTPGetGroupDetail(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {
      const group = await this.groupservice.getGroupDetails(
        "" + req.query.group
      );
      return this.sendResponse(res, "success", 200, {
        group,
      });
    } catch (error) {
      next(error);
    }
  }

  private async HTTPRemoveAUserFromGroup(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {
      await this.groupservice.removeUserFromGroup(
        "" + req.query.group,
        req.body.user,
        req.user._id
      );
      return this.sendResponse(res, "success", 204);
    } catch (error) {
      next(error);
    }
  }

  private async HTTPJoinGroupByLink(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {
      const group = await this.groupservice.joinGroupViaLink(
        req.params.id,
        req.user._id
      );
      return this.sendResponse(res, "success", 203, {
        message: `You have joined ${group} by link`,
      });
    } catch (error) {
      next(error);
    }
  }

  private async HTTPGetGroupsForUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {
      const groups_for_user = await this.groupservice.getUsersGroup(
        req.user._id
      );
      return this.sendResponse(res, "success", 200, {
        groups: groups_for_user,
      });
    } catch (error) {
      next(error);
    }
  }
}
