import { Document, ObjectId, Schema, Types, model } from "mongoose";
import { ITask } from "../../interfaces/task.interface";

export type TTask = ITask & Document;

const tasklistSchema = new Schema({
  title: {
    type: String,
    required: [true, "Input the task title"],
  },
  completed: {
    type: Boolean,
    default: false,
  },
});

const taskSchema = new Schema({
  title: {
    type: String,
    required: [true],
  },
  progress_rate: {
    type: Number,
    default: 0,
  },
  sharedBy: {
    type: Types.ObjectId,
    ref: "User",
  },
  tasklists: [tasklistSchema],
  group: {
    type: Types.ObjectId,
    ref: "Group",
  },
});

const TaskModel = model<ITask & Document>("Task", taskSchema);

export { TaskModel as Task };
