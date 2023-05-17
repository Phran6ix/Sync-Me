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
const waitlist_implementation_1 = __importDefault(require("../modules/implementation/waitlist.implementation"));
class WaitlistService {
    constructor() {
        this.waitlist_repo = new waitlist_implementation_1.default();
    }
    joinGroupWaitlist(groupid, user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let waitlist;
                //   With the group id
                // check if a waitlist for this group exist, if it does not create one
                waitlist = yield this.waitlist_repo.findAWaitlist(groupid);
                if (!waitlist) {
                    waitlist = yield this.waitlist_repo.createAWaitlist({ group: groupid });
                }
                // and the push the user
                waitlist.waiting.push({ user });
                yield waitlist.save();
                return;
            }
            catch (error) {
                throw error;
            }
        });
    }
    getUsersInWaitlist(groupid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const waitlist = yield this.waitlist_repo.findAWaitlist(groupid);
                yield waitlist.populate({
                    path: "waiting",
                    populate: "user",
                });
                yield waitlist.populate("group");
                return waitlist;
            }
            catch (error) {
                throw error;
            }
        });
    }
    acceptInvitation(userid, waitlistId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Get User in Waitlist
                //   update the field
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = WaitlistService;
