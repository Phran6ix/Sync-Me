"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Group = void 0;
const mongoose_1 = require("mongoose");
const groupSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, "Input the group name"],
        unique: [true, "Group name already exist"],
    },
    description: {
        type: String,
    },
    members: [
        {
            type: mongoose_1.Types.ObjectId,
            ref: "User",
        },
    ],
    code: {
        type: String,
        unique: false,
    },
    createdBy: {
        type: mongoose_1.Types.ObjectId,
        ref: "User",
    },
    created_on: {
        type: Date,
        default: Date.now,
    },
    photo: {
        type: String,
    },
});
const groupModel = (0, mongoose_1.model)("Group", groupSchema);
exports.Group = groupModel;
