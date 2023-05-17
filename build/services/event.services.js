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
const event_implementation_1 = __importDefault(require("../modules/implementation/event.implementation"));
class EventService {
    constructor() {
        this.event_repo = new event_implementation_1.default();
    }
    addANewEvent(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const createEvent = yield this.event_repo.createAnEvent(payload);
                return;
            }
            catch (error) {
                throw error;
            }
        });
    }
    getAllEventsInGroup(group_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.event_repo.getAllEvents(group_id);
                const events = data.filter((event) => {
                    return event.completed != false;
                });
                return events;
            }
            catch (error) {
                throw error;
            }
        });
    }
    getAnEventInGroup(event_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.event_repo.getEventById(event_id);
                return data;
            }
            catch (error) {
                throw error;
                {
                }
            }
        });
    }
    completeAnEvent(event_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.event_repo.updateAnEvent(event_id, { completed: true });
                return;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = EventService;
