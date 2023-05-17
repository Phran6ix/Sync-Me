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
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../../database/models");
class EventRepo {
    constructor() {
        this.event_model = models_1.Events;
    }
    createAnEvent(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.event_model.create(payload);
            return;
        });
    }
    getAllEvents(group_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.event_model.find({ group: group_id });
        });
    }
    getEventById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.event_model.findById(id);
        });
    }
    updateAnEvent(id, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.event_model.findByIdAndUpdate(id, payload);
        });
    }
    deleteAnEvent(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.event_model.findByIdAndDelete(id);
        });
    }
}
exports.default = EventRepo;
