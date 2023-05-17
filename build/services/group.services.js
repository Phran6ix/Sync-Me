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
const crypto_1 = __importDefault(require("crypto"));
const group_implementation_1 = __importDefault(require("../modules/implementation/group.implementation"));
const group_validator_1 = require("../validator/group.validator");
const exceptions_1 = __importDefault(require("../exception/exceptions"));
const user_implementation_1 = __importDefault(require("../modules/implementation/user.implementation"));
class GroupServices {
    constructor() {
        this.group_repo = new group_implementation_1.default();
        this.user_repo = new user_implementation_1.default();
    }
    addANewGroup(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield group_validator_1.groupSchema.validate(payload);
                const code = crypto_1.default
                    .createHash("sha256")
                    .update(`${payload.name}${payload.created_on}`)
                    .digest("hex")
                    .toString()
                    .slice(0, 10);
                const newGroup = yield this.group_repo.createGroup(Object.assign({ code }, data));
                return;
            }
            catch (error) {
                throw error;
            }
        });
    }
    addAMemberToGroup(id, user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const group = yield this.group_repo.getAGroupById(id);
                if (!group) {
                    throw new exceptions_1.default("Group not found", 404);
                }
                let userdata;
                if (user.email) {
                    userdata = yield this.user_repo.findUserByEmail(user.email);
                }
                if (user.username) {
                    userdata = yield this.user_repo.findUserByUsername(user.username);
                }
                if (this.group_repo.userInGroup(group, userdata._id))
                    throw new exceptions_1.default("User already in group", 400);
                group.members.push(userdata._id);
                yield group.save();
                return group;
            }
            catch (error) {
                throw error;
            }
        });
    }
    createLinkForGroup(url, id, user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const group = yield this.group_repo.getAGroupById(id);
                if (!group)
                    throw new exceptions_1.default("Group with this ID does not exist", 404);
                if (!this.group_repo.userInGroup(group, user))
                    throw new exceptions_1.default("You are not authorized for this action", 400);
                url = url + `${group.code}`;
                return url;
            }
            catch (error) {
                throw error;
            }
        });
    }
    updateGroup(userid, id, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const group = yield this.group_repo.getAGroupById(id);
                if (!group)
                    throw new exceptions_1.default("Group with this ID does not exist", 404);
                if (!this.group_repo.isAdmin(group, userid)) {
                    throw new exceptions_1.default("You are not authorized for this action", 403);
                }
                yield this.group_repo.updateGroup(id, payload);
                return;
            }
            catch (error) {
                throw error;
            }
        });
    }
    uploadPhoto(id, userid, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const group = yield this.group_repo.getAGroupById(id);
                if (!group)
                    throw new exceptions_1.default("Group with this id does not exist", 404);
                if (!this.group_repo.isAdmin(group, userid))
                    throw new exceptions_1.default("You are not authorized for this action", 403);
                group.photo = payload.photo;
                yield group.save();
                return;
            }
            catch (error) {
                throw error;
            }
        });
    }
    leaveGroup(groupid, user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const group = yield this.group_repo.getAGroupById(groupid);
                if (!this.group_repo.userInGroup(group, user))
                    throw new exceptions_1.default("You are not a member of this group", 404);
                let members = group.members.filter((users) => {
                    return users != user;
                });
                group.members = members;
                yield group.save();
                return group;
            }
            catch (error) {
                throw error;
            }
        });
    }
    getGroupDetails(groupid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const group = yield this.group_repo.getAGroupById(groupid);
                return group;
            }
            catch (error) {
                throw error;
            }
        });
    }
    removeUserFromGroup(groupid, userid, loggedinUser) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const group = yield this.group_repo.getAGroupById(groupid);
                if (!group)
                    throw new exceptions_1.default("Group with this ID does not exist", 404);
                if (!(yield this.group_repo.isAdmin(group, loggedinUser)))
                    throw new exceptions_1.default("You are not authorized to perform this action", 403);
                let members = group.members.filter((auser) => {
                    return auser != userid;
                });
                group.members = members;
                yield group.save();
                return;
            }
            catch (error) {
                throw error;
            }
        });
    }
    joinGroupViaLink(code, user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const group = yield this.group_repo.findAGroupByCode(code);
                if (!group)
                    throw new exceptions_1.default("Invalid code", 404);
                if (this.group_repo.userInGroup(group, user))
                    throw new exceptions_1.default("You are already a member of this group", 400);
                group.members.push(user);
                yield group.save();
                return group.name;
            }
            catch (error) {
                throw error;
            }
        });
    }
    getUsersGroup(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.group_repo.getUserGroups(user);
                // if (data.length < 1)
                //   throw new HTTPException("You do not belong in any group", 400);
                return data;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = GroupServices;
