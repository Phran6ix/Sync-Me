"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const group_services_1 = __importDefault(require("../services/group.services"));
const BaseController_1 = __importDefault(require("./BaseController"));
const auth_middleware_1 = require("../middleware/auth.middleware");
class GroupController extends BaseController_1.default {
    constructor() {
        super();
        this.router = (0, express_1.Router)();
        this.path = "/group";
        this.groupservice = new group_services_1.default();
        this.initializeRoute();
    }
    initializeRoute() {
        this.router.post(`${this.path}/new`, auth_middleware_1.protect, (...args) => this.HTTPCreateNewGroup(...args));
        this.router.patch(`${this.path}/add-user`, auth_middleware_1.protect, (...args) => this.HTTPAddAMemberToGroup(...args));
        this.router.get(`${this.path}`, auth_middleware_1.protect, (...a) => this.HTTPGetGroupDetail(...a));
        this.router.patch(`${this.path}/update/:id`, auth_middleware_1.protect, (...a) => this.HTTPUpdateGroup(...a));
        this.router.delete(`${this.path}/remove-a-member`, auth_middleware_1.protect, (...a) => this.HTTPRemoveAUserFromGroup(...a));
        this.router.get(`${this.path}/for-user`, auth_middleware_1.protect, (...s) => this.HTTPGetGroupsForUser(...s));
        this.router.patch(`${this.path}/upload-photo/:id`, auth_middleware_1.protect, (...a) => this.HTTPUploadPhoto(...a));
        this.router.get(`${this.path}/get-link/:id`, auth_middleware_1.protect, (...args) => this.HTTPGetGroupLink(...args));
        this.router.delete(`${this.path}/leave-group/:id`, auth_middleware_1.protect, (...a) => this.HTTPLeaveGroup(...a));
        this.router.patch(`${this.path}/link/:id`, auth_middleware_1.protect, (...a) => this.HTTPJoinGroupByLink(...a));
    }
    HTTPCreateNewGroup(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.groupservice.addANewGroup(Object.assign({ createdBy: req.user._id }, req.body));
                return this.sendResponse(res, "success", 201, {
                    message: "You have created a group successfully",
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    HTTPAddAMemberToGroup(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const group = yield this.groupservice.addAMemberToGroup("" + req.query.group, req.body);
                return this.sendResponse(res, "success", 200, {
                    message: `User added to ${group.name}`,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    HTTPGetGroupLink(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let url = `${req.protocol}://${req.get("host")}/group/link/`;
                const groupurl = yield this.groupservice.createLinkForGroup(url, req.params.id, req.user._id);
                return this.sendResponse(res, "success", 202, {
                    url: groupurl,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    HTTPUpdateGroup(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.groupservice.updateGroup(req.user._id, req.params.id, req.body);
                return this.sendResponse(res, "success", 203);
            }
            catch (error) {
                next(error);
            }
        });
    }
    HTTPUploadPhoto(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.groupservice.uploadPhoto(req.params.id, req.user._id, {
                    photo: req.body.photo,
                });
                return this.sendResponse(res, "success", 202, {
                    message: "Photo uploaded successfully",
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    HTTPLeaveGroup(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(req.user);
                const group = yield this.groupservice.leaveGroup(req.params.id, req.user._id);
                return this.sendResponse(res, "success", 204, {
                    message: `You have left ${group.name}`,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    HTTPGetGroupDetail(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const group = yield this.groupservice.getGroupDetails("" + req.query.group);
                return this.sendResponse(res, "success", 200, {
                    group,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    HTTPRemoveAUserFromGroup(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.groupservice.removeUserFromGroup("" + req.query.group, req.body.user, req.user._id);
                return this.sendResponse(res, "success", 204);
            }
            catch (error) {
                next(error);
            }
        });
    }
    HTTPJoinGroupByLink(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const group = yield this.groupservice.joinGroupViaLink(req.params.id, req.user._id);
                return this.sendResponse(res, "success", 203, {
                    message: `You have joined ${group} by link`,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    HTTPGetGroupsForUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const groups_for_user = yield this.groupservice.getUsersGroup(req.user._id);
                return this.sendResponse(res, "success", 200, {
                    groups: groups_for_user,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.default = GroupController;
