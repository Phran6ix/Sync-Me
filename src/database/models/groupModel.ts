import { Document, Schema, model, Types } from "mongoose";

import { IGroup } from "../../interfaces/group.interface";

const groupSchema = new Schema({
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
      type: Types.ObjectId,
      ref: "User",
    },
  ],
  code: {
    type: String,
    unique: false,
  },
  createdBy: {
    type: Types.ObjectId,
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

const groupModel = model<IGroup & Document>("Group", groupSchema);
export { groupModel as Group };
