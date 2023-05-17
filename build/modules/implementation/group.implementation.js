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
const groupModel_1 = require("../../database/models/groupModel");
const cache_implmentation_1 = __importDefault(require("./cache.implmentation"));
class GroupRepo {
    constructor() {
        this.cache = new cache_implmentation_1.default();
        this.group_model = groupModel_1.Group;
    }
    createGroup(Group) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.group_model.create(Group);
        });
    }
    userInGroup(group, user) {
        try {
            // const groups: TGroup = await this.group_model.findOne({ name: group });
            if (!group.members.includes(user)) {
                return false;
            }
            return true;
        }
        catch (error) {
            throw error;
        }
    }
    isAdmin(group, user) {
        if (group.createdBy != user) {
            return false;
        }
        return true;
    }
    getAllGroup() {
        return __awaiter(this, void 0, void 0, function* () {
            let groups;
            const redisgroups = yield this.cache.getItemsFromCache("groups");
            if (redisgroups)
                return redisgroups;
            groups = yield this.group_model
                .find()
                .populate("members", "-__v -isVerified")
                .populate("createdBy", "-__v -_id -isVerified");
            yield this.cache.addItemToCache("group", groups);
            return groups;
        });
    }
    getAGroupById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const redisdata = yield this.cache.getItemFromCache(`group-${id}`);
            if (redisdata)
                return redisdata;
            const data = yield this.group_model
                .findById(id)
                .populate("members", "-__v -isVerified")
                .populate("createdBy", "-__v -_id -isVerified");
            yield this.cache.addItemToCache(`group-${data._id}`, data);
            return data;
        });
    }
    updateGroup(id, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = this.group_model.findByIdAndUpdate(id, payload);
            yield this.cache.updateDataInCache(`group-${id}`, data);
            return data;
        });
    }
    findAGroupByCode(code) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.group_model.findOne({ code });
        });
    }
    getUserGroups(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const redis_data = yield this.cache.getItemsFromCache(`${user_id}-groups`);
            // if (redis_data) return redis_data;
            const useringroup = yield this.group_model
                .find({
                members: user_id,
            })
                .populate("createdBy", "-__v -_id -isVerified -email ")
                .select("name description createdBy photo");
            yield this.cache.addItemToCache(`${useringroup}-groups`, useringroup);
            return useringroup;
        });
    }
}
exports.default = GroupRepo;
