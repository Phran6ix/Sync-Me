"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Task = void 0;
const mongoose_1 = require("mongoose");
const tasklistSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: [true, "Input the task title"],
    },
    completed: {
        type: Boolean,
        default: false,
    },
});
const taskSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: [true],
    },
    progress_rate: {
        type: Number,
        default: 0,
    },
    sharedBy: {
        type: mongoose_1.Types.ObjectId,
        ref: "User",
    },
    tasklists: [tasklistSchema],
    group: {
        type: mongoose_1.Types.ObjectId,
        ref: "Group",
    },
});
const TaskModel = (0, mongoose_1.model)("Task", taskSchema);
exports.Task = TaskModel;
