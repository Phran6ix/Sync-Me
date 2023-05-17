"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Waitlist = void 0;
const mongoose_1 = require("mongoose");
const waitingSchema = new mongoose_1.Schema({
    group: {
        type: mongoose_1.Types.ObjectId,
        ref: "Group",
    },
    waiting: [
        {
            user: {
                type: mongoose_1.Types.ObjectId,
                ref: "User",
            },
            accepted: {
                type: Boolean,
                default: false,
            },
            createdOn: {
                type: Date,
                default: Date.now,
            },
        },
    ],
});
const waitingModel = (0, mongoose_1.model)("Waiting", waitingSchema);
exports.Waitlist = waitingModel;
