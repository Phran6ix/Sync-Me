"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Events = void 0;
const mongoose_1 = require("mongoose");
const eventsSchema = new mongoose_1.Schema({
    group: {
        type: mongoose_1.Types.ObjectId,
        required: true,
        ref: "Group",
    },
    description: {
        type: String,
        required: [true, "Input events description"],
    },
    photo: {
        type: String,
    },
    date: {
        type: Date,
    },
    location: {
        type: String,
    },
    completed: {
        type: Boolean,
        default: false,
    },
    time: {
        type: String,
    },
}, {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    _id: false,
    versionKey: false,
});
eventsSchema.index({ completed: 1 });
const eventModel = (0, mongoose_1.model)("Event", eventsSchema);
exports.Events = eventModel;
